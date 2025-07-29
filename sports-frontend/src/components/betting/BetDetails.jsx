import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack, AttachMoney, TrendingUp } from '@mui/icons-material';
import axios from 'axios';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Button,
    TextField,
    CircularProgress,
    Alert,
    Chip,
    Card,
    CardContent,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';

const BetDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('')
    const [placingBet, setPlacingBet] = useState(false);
    const [betAmount, setBetAmount] = useState(50);
    const [selectedWinner, setSelectedWinner] = useState('');
    const [betSucess, setBetSuccess] = useState('');

    useEffect(() => {
        fetchGameDetails();
    }, [id]);

    const fetchGameDetails = async () => {
        try {
            setLoading(true);
            const resposne = await axios.get(`/games/${id}`);
            setGame(response.data);
        } catch (error) {
            setError('Failed to load game details');
            console.error('Error fetching game:', error);
        } finally {
            setLoading(false);
        }
    };

    const placeBet = async () => {
        if (!selectedWinner || betAmount <= 0) {
            setError('Please select a winner and enter a valid bet amount');
            return;
        }

        try {
            setPlacingBet(true);
            setError('');

            const response = await axios.post('/bets', {
                gameId: parseInt(id),
                winner: selectedWinner,
                betAmount: parseFloat(betAmount)
            });

            setBetSuccess('Bet placed successfully');
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            setError('error.response?.data?.error' || 'Failed to place bet');
        } finally {
            setPlacingBet(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'UPCOMING': return 'primary';
            case 'ONGOING': return 'error';
            case 'FINISHED': return 'success';
            default: return 'default';
        }
    };

    const formatDateTime = (dateTime) => {
        return new Date(dateTime).toLocaleString();
    };

    const calculatePotentialWinnings = () => {
        return betAmount * 2;
    }

    if (loading) {
        return (
            <Container maxWidth="md">
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    };

    if (error && !game) {
        return (
            <Container maxWidth="md">
                <Box sx={{ mt: 4 }}>
                    <Alert severity="error">{error}</Alert>
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => navigate('/')}
                        sx={{ mt: 2 }}
                    >
                        Back to Betting Cards
                    </Button>
                </Box>
            </Container>
        );
    };

    if (!game) {
        return (
            <Container maxWidth="md">
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                        Game not found
                    </Typography>
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => navigate('/')}
                        sx={{ mt: 2 }}
                    >
                        Back to Betting Cards
                    </Button>
                </Box>
            </Container>
        );
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/')}
                    sx={{ mt: 3 }}
                >
                    Back to Betting Cards
                </Button>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                )}

                {betSuccess && (
                    <Alert severity="success" sx={{ mb: 2 }}>{betSucess}</Alert>
                )}

                <Paper elevation={3} sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography varient="h4" component="h1">
                            Game Details
                        </Typography>
                        <Chip  
                            label={game.status}
                            color={getStatusColor(game.status)}
                            size="large"
                        />
                    </Box>

                    <Grid container spacing={4}>
                        <Grid items xs={12} md={6}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography varient="h6" gutterBottom>
                                        Match Information
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />

                                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                                        <Typography variant="h4" gutterBottom>
                                            {game.homeTeam}
                                        </Typography>
                                        <Typography variant="h6" gutterBottom>
                                            VS
                                        </Typography>
                                        <Typography variant="h4" gutterBottom>
                                            {game.awayTeam}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mt: 3 }}>
                                        <Typography variant="body1" gutterBottom>
                                            <Strong>Start Time:</Strong> {formatDateTime(game.startTime)}
                                        </Typography>
                                        <Typography variant="body1" gutterBottom>
                                            <Strong>Status:</Strong> {game.status}
                                        </Typography>
                                        {game.homeScore !== null && game.awayScore !== null && (
                                            <Typography variant="body1" gutterBottom>
                                                <Strong>Score:</Strong> {game.homeScore} - {game.awayScore}
                                            </Typography>
                                        )}
                                        {game.winner && (
                                            <Typography variant="body1" gutterBottom>
                                                <Strong>Winner:</Strong> {game.winner}
                                            </Typography>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Place your Bet
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />

                                    <FormControl fullWidth sx={{ mb: 3 }}>
                                        <InputLabel>Select Winner</InputLabel>
                                        <Select
                                            value={selectedWinner}
                                            label="Select Winner"
                                            onChange={(e) => setSelectedWinner(e.target.value)}
                                        >
                                            <MenuItem value="HOME">{game.homeTeam}</MenuItem>
                                            <MenuItem value="AWAY">{game.awayTeam}</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <TextField
                                        fullWidth
                                        label="Bet Amount ($)"
                                        type="number"
                                        value={betAmount}
                                        onChange={(e) => setBetAmount(e.target.value)}
                                        sx={{ mb: 3 }}
                                        InputProps={{
                                            startAdornment: <AttachMoney />
                                        }}
                                    />

                                    <Box sx={{
                                        p: 2,
                                        bgcolor: 'gray.100',
                                        borderRadius: 1,
                                        mb: 3,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        <TrendingUp color="primary" />
                                        <Typography variant="body2">
                                            <strong>Potential Winnings:</strong> ${calculatePotentialWinnings().toFixed(2)}
                                        </Typography>
                                    </Box>

                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        onClick={placeBet}
                                        disabled={placingBet || !selectedWinner || betAmount <= 0} 
                                        sx={{ mb: 2 }}
                                    >
                                        {placingBet ? <CircularProgress size={24} /> : 'Place Bet'}
                                    </Button>

                                    {/* <Typography variant="caption" color="text.secondary">
                                        * Odds are si
                                    </Typography> */}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </Container>
    );
}

export default BetDetails;