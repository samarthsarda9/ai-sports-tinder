import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RefreshCw, AlertCircle, DollarSign } from 'lucide-react';

import BettingCard from './BettingCard';
import SportSelector from './SportsSelector';
import BetDetailsModal from './BetDetailsModal';
import { fetchRecommendations } from '../../service/RecommendationService';
import { placeBet } from '../../service/betService';
import { useAuth } from '../../contexts/AuthContext';

const BettingInterface = () => {
    const { user, setUser } = useAuth();

    const [currentBetIndex, setCurrentBetIndex] = useState(0);
    const [selectedBet, setSelectedBet] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [swipeDirection, setSwipeDirection] = useState(null);

    const [bets, setBets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedSport, setSelectedSport] = useState('baseball_mlb');

    const AVAILABLE_SPORTS = [
        { key: 'americanfootball_nfl', label: 'NFL' },
        { key: 'basketball_nba', label: 'NBA' },
        { key: 'baseball_mlb', label: 'MLB' },
        { key: 'icehockey_nhl', label: 'NHL' },
        { key: 'basketball_ncaab', label: 'NCAAB' },
        { key: 'soccer_epl', label: 'EPL' },
        { key: 'soccer_usa_mls', label: 'MLS' }
    ];

    const getRecommendations = useCallback(async (sportKey) => {
        setLoading(true);
        setError('');
        try {
            const data = await fetchRecommendations(sportKey);
            setBets(data);
            setSelectedSport(sportKey)
        } catch (error) {
            setError('Failed to load betting recommendations.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedSport) {
            getRecommendations(selectedSport);
        }
    }, [selectedSport, getRecommendations]);

    const refreshBets = () => {
        getRecommendations();
    }

    const handleSportChange = (sportKey) => {
        setSelectedSport(sportKey);
    }

    const handleSwipe = (direction, bet) => {
        setSwipeDirection(direction);

        if (direction === 'right') {
            setSelectedBet(bet);
            setIsModalOpen(true);
        }

        setTimeout(() => {
            setCurrentBetIndex(prev => Math.min(prev + 1, bets.length));
            setSwipeDirection(null);
        }, 300);
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
            type: bet.betType,
            line: bet.line,
            odds: bet.odds,
            overUnder: bet.overUnder,
            gameTime: bet.gameTime,
            description: bet.description,
            amount: amount,
            gameId: bet.game.id
        };

        const result = await placeBet(betData);

        if (result.success) {
            setUser(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    walletBalance: prev.profile.walletBalance - amount
                }
            }))
        } else {
            console.error (result.error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBet(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
                <div className="max-w-md mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">BetSwipe</h1>
                            <p className="text-blue-200 text-sm">Live Sports Betting</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 rounded-full px-3 py-1">
                                <div className="flex items-center space-x-1">
                                    <DollarSign className="w-4 h-4 text-yellow-300" />
                                    <span className="font-semibold">
                                        ${user?.profile?.walletBalance.toLocaleString() || '0.00'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-md mx-auto px-4 py-6">
                <div className="space-y-6">
                    {/* API Status and Controls */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-white font-semibold">Live Odds</h3>
                            <div className="flex items-center space-x-2">
                                {loading && (
                                    <RefreshCw className="w-4 h-4 text-blue-300 animate-spin" />
                                )}
                                <button
                                    onClick={refreshBets}
                                    disabled={loading}
                                    className="text-blue-300 hover:text-white transition-colors disabled:opacity-50"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* {!isApiKeyValid && (
                            <div className="flex items-center space-x-2 text-yellow-300 text-sm mb-3">
                                <AlertCircle className="w-4 h-4" />
                                <span>API key not configured. Using demo mode.</span>
                            </div>
                        )} */}

                        {error && (
                            <div className="flex items-center space-x-2 text-red-300 text-sm mb-3">
                                <AlertCircle className="w-4 h-4" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

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
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
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
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
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
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
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
                                className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ✕
                            </button>
                            <button
                                onClick={() => handleSwipe('right', bets[currentBetIndex])}
                                disabled={loading}
                                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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