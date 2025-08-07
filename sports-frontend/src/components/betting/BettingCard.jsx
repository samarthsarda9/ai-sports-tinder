import React from 'react';
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Target, Clock } from 'lucide-react'

const BettingCard = ({ bet, onSwipe, onCardClick }) => {

    const handleDragEnd = (event, info) => {
        const swipeThreshold = 50;
        if (info.offset.x > swipeThreshold) {
            onSwipe('right', bet);
        } else if (info.offset.x < -swipeThreshold) {
            onSwipe('left', bet);
        }
    };

    const getRecommendationColor = (recommendation) => {
        switch(recommendation) {
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

    const formatGameTime = (gameTime) => {
        return new Date(gameTime).toLocaleDateString('en-us', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    return (
        <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={handleDragEnd}
            whileTap={{ scale: 0.95 }}
            className='relative w-full max-w-sm mx-auto cursor-grab active:cursor-grabbing'
        >
            <div 
                className='bg-white rounded-2xl shadow-xl overflow-hidden'
                onClick={() => onCardClick(bet)}
            >
                {/*Header*/}
                <div className='bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6'>
                    <div className='flex justify-between items-start mb-4'>
                        <div>
                            <h2 className='text-xl font-bold'>{bet.player}</h2>
                            <p className='text-blue-100'>{bet.team} vs {bet.opponent}</p>
                        </div>
                        <div className='text-right'>
                            <span className='bg-white/20 px-3 py-1 rounded-full text-sm font-medium'>
                                {bet.sport}
                            </span>
                        </div>
                    </div>

                    <div className='flex items-center justify-between'>
                        <div className='text-center'>
                            <p className='text-sm text-blue-100'>Line</p>
                            <p className='text-2xl font-bold'>{bet.line}</p>
                        </div>
                        <div className='text-center'>
                            <p className='text-sm text-blue-100'>Odds</p>
                            <p className='text-2xl font-bold'>{formatOdds(bet.odds)}</p>
                        </div>
                        <div className='text-center'>
                            <p className='text-sm text-blue-100'>Confidence</p>
                            <p className='text-2xl font-bold'>{bet.confidence}</p>
                        </div>
                    </div>
                </div>

                {/*Bet Details*/}
                <div className='p-6'>
                    <div className='flex items-center justify-between mb-4'>
                        <div className='flex items-center space-x-2'>
                            <Target className='w-5 h-5 text-gray-500' />
                            <span className='font-semibold text-gray-800'>{bet.betType}</span>
                        </div>
                        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
                            bet.overUnder === 'Over' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                            {bet.overUnder === 'Over' ? (
                                <TrendingUp className='w-4 h-4' />
                            ) : (
                                <TrendingDown className='w-4 h-4' />
                            )}
                            <span className='font-medium'>{bet.overUnder}</span>
                        </div>
                    </div>

                    {/*AI Analysis*/}
                    <div className='bg-gray-50 rounded-lg p-4 mb-4'>
                        <div className='flex items-center justify-between mb-2'>
                            <h4 className='font-semibold text-gray-800'>AI Analysis</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRecommendationColor(bet.aiAnalysis.recommendation)}`}>
                                {bet.aiAnalysis.recommendation}
                            </span>
                        </div>
                        <p className='text-sm text-gray-600 line-clamp-2'>{bet.aiAnalysis.reasoning}</p>
                        <div className='flex items-center justify-between mt-2'>
                            <span className='text-xs text-gray-500'>
                                Confidence: {bet.aiAnalysis.confidence}%
                            </span>
                            <span className={`text-xs font-medium ${getRiskColor(bet.aiAnalysis.riskLevel)}`}>
                                Risk: {bet.aiAnalysis.riskLevel}
                            </span>
                        </div>
                    </div>

                    {/*Game Time*/}
                    <div className='flex items-center space-x-2 text-sm text-gray-500'>
                        <Clock className='w-4 h-4' />
                        <span>{formatGameTime(bet.gameTime)}</span>
                    </div>
                </div>

                {/*Swipe Instructions*/}
                <div className='bg-gray-50 px-6 py-4 border-t'>
                    <div className='flex justify-between items-center text-sm text-gray-500'>
                        <div className='flex items-center space-x-2'>
                            <div className='w-3 h-3 bg-red-400 rounded-full'></div>
                            <span>Swipe left to pass</span>
                        </div>
                        <div className='flex items-center space-x-2'>
                            <span>Swipe right to bet</span>
                            <div className='w-3 h-3 bg-green-400 rounded-full'></div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default BettingCard;