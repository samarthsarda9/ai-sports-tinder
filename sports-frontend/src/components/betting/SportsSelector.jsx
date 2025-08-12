import React from 'react';
import { motion } from 'framer-motion';

const SportSelector = ({
    selectedSport,
    availableSports,
    onSportChange,
    loading
}) => {
    const sportIcons = {
        'basketball_nba': '🏀',
        'americanfootball_nfl': '🏈',
        'baseball_mlb': '⚾',
        'icehockey_nhl': '🏒',
        'basketball_ncaab': '🏀',
        'soccer_epl': '⚽',
        'soccer_usa_mls': '⚽'
    };

    return (
        <div className='card p-4 mb-6'>
            <h3 className='text-white font-semibold mb-3'>Select Sport</h3>
            <div className='grid grid-cols-3 gap-2'>
                {availableSports.map((sport) => (
                    <motion.button 
                        key={sport.key}
                        onClick={() => onSportChange(sport.key)}
                        disabled={loading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-3 rounded-lg text-center transition-all duration-200 ${
                            selectedSport === sport.key
                            ? 'bg-brand-600 text-white shadow-lg'
                            : 'bg-white/20 text-blue-200 hover:bg-white/30'
                        } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <div className='text-2xl mb-1'>
                            {sportIcons[sport.key] || '🏆'}
                        </div>
                        <div className='text-xs font-medium'>
                            {sport.label}
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default SportSelector;