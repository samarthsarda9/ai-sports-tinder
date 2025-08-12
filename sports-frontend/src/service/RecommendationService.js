import axios from 'axios';

const memoryCache = new Map();

const DEFAULT_TTL_MS = 5 * 60 * 1000; 
const LS_PREFIX = 'recs:';

function getLocalKey(sportKey) {
    return `${LS_PREFIX}${sportKey}`;
}

function readLocalCache(sportKey) {
    try {
        const raw = localStorage.getItem(getLocalKey(sportKey));
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.data) || typeof parsed.expiry !== 'number') return null;
        if (Date.now() >= parsed.expiry) return null;
        return parsed;
    } catch {
        return null;
    }
}

function writeLocalCache(sportKey, data, ttlMs) {
    const expiry = Date.now() + ttlMs;
    try {
        localStorage.setItem(getLocalKey(sportKey), JSON.stringify({ data, expiry }));
    } catch { }
    memoryCache.set(sportKey, { data, expiry, promise: null });
}

export function invalidateRecommendations(sportKey) {
    memoryCache.delete(sportKey);
    try {
        localStorage.removeItem(getLocalKey(sportKey));
    } catch { }
}

export async function refreshRecommendations(sportKey, { ttlMs = DEFAULT_TTL_MS, signal } = {}) {
    const response = await axios.get('/recommendation', {
        params: { sport: sportKey },
        signal
    });
    const data = Array.isArray(response.data) ? response.data : [];
    writeLocalCache(sportKey, data, ttlMs);
    return data;
}

export async function fetchRecommendations(sportKey, options = {}) {
    const {
        preferCache = true,
        backgroundRefresh = true,
        ttlMs = DEFAULT_TTL_MS,
        signal
    } = options;

    const now = Date.now();
    const mem = memoryCache.get(sportKey);

    if (preferCache && mem?.data && mem.expiry > now) {
        return mem.data;
    }

    if (preferCache) {
        const disk = readLocalCache(sportKey);
        if (disk && disk.data) {
            memoryCache.set(sportKey, { data: disk.data, expiry: disk.expiry, promise: null });
            if (backgroundRefresh) {
                refreshRecommendations(sportKey, { ttlMs, signal }).catch(() => { });
            }
            return disk.data;
        }
    }

    if (mem?.promise) {
        return mem.promise;
    }

    const pending = refreshRecommendations(sportKey, { ttlMs, signal });
    memoryCache.set(sportKey, {
        data: mem?.data ?? null,
        expiry: mem?.expiry ?? 0,
        promise: pending
    });

    try {
        const data = await pending;
        return data;
    } finally {
        const curr = memoryCache.get(sportKey);
        if (curr?.promise === pending) {
            memoryCache.set(sportKey, { data: curr.data, expiry: curr.expiry, promise: null });
        }
    }
}