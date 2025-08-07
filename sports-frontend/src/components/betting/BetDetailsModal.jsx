import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Clock, DollarSign, Brain, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const BetDetailsModal = ({ bet, isOpen, onClose, onPlaceBet, userBalance }) => {
    const [betAmount, setBetAmount] = useState(50);

    if (!bet) return null;

    const getRecommendationIcon = (recommendation) => {
        switch (recommendation) {
            case 'Strong Bet': return <CheckCircle className='w-5 h-5 text-green-600' />;
            case 'Good Bet': return <CheckCircle className='w-5 h-5 text-blue-600' />;
            case 'Risky Bet': return <AlertTriangle className='w-5 h-5 text-yellow-600' />;
            case 'Avoid': return <XCircle className='w-5 h-5 text-red-600' />;
            default: return <Brain className='w-5 h-5 text-gray-600' />;
        }
    };

    const getRecommendationColor = (recommendation) => {
        switch (recommendation) {
            case 'Strong Bet': return 'text-green-600 bg-green-100';
            case 'Good Bet': return 'text-blue-600 bg-blue-100';
            case 'Risky Bet': return 'text-yellow-600 bg-yellow-100';
            case 'Avoid': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getRiskColor = (risk) => {
        switch (risk) {
            case 'Low': return 'text-green-600';
            case 'Medium': return 'text-yellow-600';
            case 'High': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    const formatOdds = (odds) => {
        if (odds > 0) return `+${odds}`;
        return odds.toString();
    };

    const calculatePayout = (amount, odds) => {
        if (odds > 0) return amount + (amount * odds / 100);
        else return amount + (amount * 100 / Math.abs(odds));
    }

    const handlePlaceBet = () => {
        onPlaceBet(bet, betAmount);
        onClose();
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p4 z-50'
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/**Header*/}
                        <div className='bg-gradient-to-r from-blue-600 to-purple-600 text-white-p-6 rounded-t-xl relative'>
                            <div className='text-center'>
                                <h2 className='text-white text-2xl font-bold mb-1 '>{bet.player}</h2>
                                <p className='text-blue-100 text-lg mb-1'>{bet.team} vs {bet.opponent}</p>
                                <p className='text-blue-100'>{bet.sport} • {bet.betType}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className='absolute top-3 right-3 text-white hover:text-blue-100 transition-colors'
                            >
                                <X className='w-6 h-6' />
                            </button>
                        </div>

                        <div className='p-5 space-y-6'>
                            {/**Bet Details*/}
                            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                                <div className='text-center p-4 bg-gray-50 rounded-lg'>
                                    <p className='text-sm text-gray-600'>Line</p>
                                    <p className='text-2xl font-bold text-gray-800'>{bet.line}</p>
                                </div>
                                <div className='text-center p-4 bg-gray-50 rounded-lg'>
                                    <p className='text-sm text-gray-600'>Odds</p>
                                    <p className='text-xl font-bold text-gray-800'>{formatOdds(bet.odds)}</p>
                                </div>
                                <div className='text-center p-4 bg-gray-50 rounded-lg'>
                                    <p className='text-sm text-gray-600'>Confidence</p>
                                    <p className='text-2xl font-bold text-gray-800'>{bet.aiAnalysis.confidence}</p>
                                </div>
                                <div className='text-center p-4 bg-gray-50 rounded-lg'>
                                    <p className='text-sm text-gray-600'>Direction</p>
                                    <div className={`flex items-center justify-center space-x-1 px-2 py-1 rounded-full mx-auto w-fit ${bet.overUnder === 'Over' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {bet.overUnder === 'Over' ? (
                                            <TrendingUp className='w-4 h-4' />
                                        ) : (
                                            <TrendingDown className='w-4 h-4' />
                                        )}
                                        <span className='font-medium'>{bet.overUnder}</span>
                                    </div>
                                </div>
                            </div>

                            {/**AI Analysis */}
                            <div className='border rounded-lg p-4'>
                                <div className='flex items-center justify-center space-x-2 mb-4'>
                                    <Brain className='w-5 h-4 text-purple-600' />
                                    <h3 className='font-semibold text-gray-800'>AI Analysis</h3>
                                </div>

                                <div className={`flex items-center justify-center space-x-2 mb-3 p-3 rounded-lg border ${getRecommendationColor(bet.aiAnalysis.recommendation)}`}>
                                    {getRecommendationIcon(bet.aiAnalysis.recommendation)}
                                    <span className='font-semibold'>{bet.aiAnalysis.recommendation}</span>
                                </div>

                                <div className='mb-4'>
                                    <h4 className='font-medium text-gray-800 mb-2'>Reasoning</h4>
                                    <p className='text-gray-600'>{bet.aiAnalysis.reasoning}</p>
                                </div>

                                <div className='grid grid-cols-2 gap-4 mb-4'>
                                    <div className={`p-3 rounded-lg ${getRiskColor(bet.aiAnalysis.riskLevel)}`}>
                                        <p className='text-sm font-medium'>Risk Level</p>
                                        <p className='font-semibold'>{bet.aiAnalysis.riskLevel}</p>
                                    </div>
                                    <div className='p-3 rounded-lg bg-blue-50'>
                                        <p className='text-sm font-medium'>Risk Level</p>
                                        <p className='font-semibold text-blue-700'>{bet.aiAnalysis.confidence}%</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className='font-medium text-gray-800 mb-2'>Key Factors</h4>
                                    <ul className='space-y-1'>
                                        {bet.aiAnalysis.keyFactors.map((factor, index) => (
                                            <li key={index} className='flex items-center justify-center space-x-2 text-sm text-gray-600'>
                                                <div className='w-1.5 h-1.5 bg-blue-500 rounded-full'></div>
                                                <span>{factor}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/**Game Info */}
                            <div className='bg-gray-50 rounded-lg p-4'>
                                <div className='flex items-center justify-center space-x-2 mb-2'>
                                    <Clock className='w-5 h-5 text-gray-500' />
                                    <h3 className='font-semibold text-gray-800'>Game Information</h3>
                                </div>
                                <p className='text-gray-600'>
                                    {new Date(bet.gameTime).toLocaleDateString('en-us', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>

                            {/**Place Bet Section */}
                            <div className='border-t pt-6'>
                                <h3 className='font-semibold text-gray-800 mb-4'>Place Your Bet</h3>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Bet Amount (Virtual Currency)
                                        </label>
                                        <div className='relative'>
                                            <DollarSign className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                                            <input
                                                type='number'
                                                value={betAmount}
                                                onChange={(e) => setBetAmount(parseInt(e.target.value)) || 0}
                                                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                                min="10"
                                                max={userBalance}
                                            />
                                        </div>
                                        <p className='text-sm text-gray-500 mt-1'>
                                            Available: ${userBalance.toLocaleString()}
                                        </p>
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Potential Payout
                                        </label>
                                        <div className='p-3 bg-green-50 rounded-lg'>
                                            <p className='text-lg font-bold text-green-700'>
                                                ${calculatePayout(betAmount, bet.odds).toFixed(2)}
                                            </p>
                                            <p className='text-sm text-green-600'>
                                                Profit ${(calculatePayout(betAmount, bet.odds) - betAmount).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePlaceBet}
                                    disabled={betAmount < 10 || betAmount > userBalance}
                                    className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold
                                     hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    Place Bet for ${betAmount}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BetDetailsModal;