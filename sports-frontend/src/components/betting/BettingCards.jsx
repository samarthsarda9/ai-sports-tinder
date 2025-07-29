import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { ThumbUp, ThumbDown, Visibility } from '@mui/icons-material';
import axios from 'axios';
import { fetchOddsForSport } from '../../services/oddsApi';
import {
    Container,
    Box,
    Typography,
    CircularProgress,
    Alert,
    Chip,
    Card,
    CardContent,
    Button,
    Grid
} from '@mui/material';

const sportOptions = [
    { key: 'basketball_nba', label: 'NBA Basketball' },
    { key: 'soccer_epl', label: 'English Premier League' },
    { key: 'americanfootball_nfl', label: 'NFL Football' },
    { key: 'baseball_mlb', label: 'MLB Baseball' },
    { key: 'icehockey_nhl', label: 'NHL Hockey' },
    { key: 'basketball_ncaab', label: 'NCAA Basketball' },
    { key: 'americanfootball_ncaaf', label: 'NCAA Football' }
];

const BettingCards = () => {
    // Games from OddsApi
    const [sportsKey, setSportsKey] = useState('americanfootball_nfl');
    const [oddsGames, setOddsGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [placingBet, setPlacingBet] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchGames();
    }, [sportsKey]);

    const handleFetchOdds = async () => {
        setOddsLoading(true);
        setError('');
        setOddsGames([]);
        setCurrentIndex(0);

        try {
            const data = await fetchOddsForSports(sportsKey);
            setOddsGames(data);
        } catch (error) {
            setError('Failed to fetch odds. Please try again.');
            console.error('Error fetching odds', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSwipe = (direction) => {
        if (currentIndex >= oddsGames.length) return;

        
    }
}