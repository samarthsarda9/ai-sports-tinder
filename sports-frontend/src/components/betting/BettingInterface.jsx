import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RefreshCw, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import BettingCard from './BettingCard';
import SportSelector from './SportsSelector';
import BetDetailsModal from './BetDetailsModal';
import { fetchRecommendations } from '../../service/RecommendationService';
import { placeBet } from '../../service/betService';
import { useAuth } from '../../contexts/AuthContext';

const BettingInterface = () => {
    const { user, setUser, logout } = useAuth();
    const navigate = useNavigate();

    const [currentBetIndex, setCurrentBetIndex] = useState(0);
    const [selectedBet, setSelectedBet] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [swipeDirection, setSwipeDirection] = useState(null);

    const [bets, setBets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedSport, setSelectedSport] = useState('baseball_mlb');
    const [placedBetKeys, setPlacedBetKeys] = useState(() => {
        try {
            const raw = localStorage.getItem('placedBetKeys');
            return raw ? new Set(JSON.parse(raw)) : new Set();
        } catch {
            return new Set();
        }
    });

    const persistPlacedBetKeys = (nextSet) => {
        setPlacedBetKeys(new Set(nextSet));
        try {
            localStorage.setItem('placedBetKeys', JSON.stringify(Array.from(nextSet)));
        } catch {}
    };

    const computeBetKey = (bet) => {
        const parts = [bet?.game?.id, bet?.type, bet?.overUnder, String(bet?.line)];
        return parts.filter(Boolean).join('|');
    };

    const AVAILABLE_SPORTS = [
        { key: 'americanfootball_nfl', label: 'NFL' },
        { key: 'basketball_nba', label: 'NBA' },
        { key: 'baseball_mlb', label: 'MLB' }
    ];

    const getRecommendations = useCallback(async (sportKey) => {
        setLoading(true);
        setError('');
        try {
            const data = await fetchRecommendations(sportKey);
            const filtered = data.filter((bet) => !placedBetKeys.has(computeBetKey(bet)));
            setBets(filtered);
            setCurrentBetIndex(0);
        } catch (error) {
            setError('Failed to load betting recommendations.');
        } finally {
            setLoading(false);
        }
    }, [placedBetKeys]);

    useEffect(() => {
        if (selectedSport) {
            getRecommendations(selectedSport);
        }
    }, [selectedSport, getRecommendations]);

    const refreshBets = () => {
        getRecommendations(selectedSport);
    }

    const handleSportChange = (sportKey) => {
        setSelectedSport(sportKey);
    }

    const advanceToNextCard = () => {
        setTimeout(() => {
            setCurrentBetIndex(prev => Math.min(prev + 1, bets.length));
            setSwipeDirection(null);
        }, 50);
    }

    const handleSwipe = (direction, bet) => {
        setSwipeDirection(direction);

        if (direction === 'right') {
            setSelectedBet(bet);
            setIsModalOpen(true);
        } else {
            setTimeout(() => {
                setCurrentBetIndex(prev => Math.min(prev + 1, bets.length));
                setSwipeDirection(null);
            }, 300);
        }
    };

    const handleCardClick = (bet) => {
        setSelectedBet(bet);
        setIsModalOpen(true);
    };

    const handlePlaceBet = async (bet, amount) => {
        const betData = {
            player: bet.player,
            team: bet.team,
            opponent: bet.opponent,
            sport: bet.sport,
            type: bet.type,
            line: bet.line,
            odds: bet.odds,
            overUnder: bet.overUnder,
            gameTime: bet.gameTime,
            description: bet.description,
            amount: amount,
            gameId: bet.game.id
        };

        const betKey = computeBetKey(bet);
        if (placedBetKeys.has(betKey)) {
            setIsModalOpen(false);
            setSelectedBet(null);
            return;
        }

        const result = await placeBet(betData);

        if (result.success) {
            setUser(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    walletBalance: prev.profile.walletBalance - amount
                }
            }));

            const next = new Set(placedBetKeys);
            next.add(betKey);
            persistPlacedBetKeys(next);

            setBets((prev) => prev.filter((b, idx) => !(idx === currentBetIndex)));
            setIsModalOpen(false);
            setSelectedBet(null);
            advanceToNextCard();
        } else {
            console.error (result.error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBet(null);
    };

    const handleLogout = () => {
        logout();
    };

    const goToProfile = () => {
        navigate('/profile');
    }

    return (
        <div className='min-h-screen'>
            {/* Main Content */}
            <div className="container-app py-6">
                <div className="space-y-6">
                    {error && (
                        <div className="flex items-center space-x-2 text-red-300 text-sm mb-3">
                            <AlertCircle className="w-4 h-4" />
                            <span>{error}</span>
                        </div>
                    )}
                    {/* Sport Selector */}
                    <SportSelector
                        selectedSport={selectedSport}
                        availableSports={AVAILABLE_SPORTS}
                        onSportChange={handleSportChange}
                        loading={loading}
                    />

                    {/* Betting Cards */}
                    <div className="relative">
                        {loading ? (
                            <div className="card p-8 text-center">
                                <RefreshCw className="w-16 h-16 text-blue-300 animate-spin mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Loading Live Odds...</h3>
                                <p className="text-blue-200">Fetching the latest betting opportunities</p>
                            </div>
                        ) : bets.length > 0 && currentBetIndex < bets.length ? (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={bets[currentBetIndex].id}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{
                                        scale: 1,
                                        opacity: 1,
                                        x: swipeDirection === 'left' ? -300 : swipeDirection === 'right' ? 300 : 0,
                                        rotate: swipeDirection === 'left' ? -20 : swipeDirection === 'right' ? 20 : 0
                                    }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full"
                                >
                                    <BettingCard
                                        bet={bets[currentBetIndex]}
                                        onSwipe={handleSwipe}
                                        onCardClick={handleCardClick}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            <div className="card p-8 text-center">
                                <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">
                                    {bets.length === 0 ? 'No Live Bets Available' : 'No More Bets!'}
                                </h3>
                                <p className="text-blue-200 mb-4">
                                    {bets.length === 0
                                        ? 'Try selecting a different sport or check back later for new opportunities!'
                                        : "You've seen all available bets. Check back later for new opportunities!"
                                    }
                                </p>
                                {bets.length > 0 && (
                                    <button
                                        onClick={refreshBets}
                                        className="btn btn-primary px-6 py-2"
                                    >
                                        Reset Cards
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    {bets.length > 0 && currentBetIndex < bets.length && (
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => handleSwipe('left', bets[currentBetIndex])}
                                disabled={loading}
                                className="btn btn-danger btn-circle"
                            >
                                ✕
                            </button>
                            <button
                                onClick={() => handleSwipe('right', bets[currentBetIndex])}
                                disabled={loading}
                                className="btn btn-success btn-circle"
                            >
                                ✓
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Bet Detail Modal */}
            <BetDetailsModal
                bet={selectedBet}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onPlaceBet={handlePlaceBet}
                userBalance={user?.profile?.walletBalance || 0}
            />
        </div>
    );
};

export default BettingInterface;