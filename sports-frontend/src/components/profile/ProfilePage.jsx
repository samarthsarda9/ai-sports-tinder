import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const { user } = useAuth();
    const [bets, setBets] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchBets = async () => {
            try {
                const response = await axios.get('/bets/user');
                setBets(response.data);
            } catch (error) {
                console.error ("Failed to fetch user bets:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBets();
    }, []);

    const activeBets = bets.filter(bet => bet.status === 'ACTIVE');
    const pastBets = bets.filter(bet => bet.status !== 'ACTIVE');

    const goBackToHome = () => {
        navigate('/');
    }

    return (
        <div className='min-h-screen bg-gray-900 text-white p-4'>
            <button
                onClick={goBackToHome}
                className="absolute left-5 top-5 text-gray-300 hover:text-white transition-colors"
            >
                <ArrowLeft size={30}/>
                <span>Home</span>
            </button>
            <div className='max-w-4xl mx-auto'>
                <h1 className='text-3xl font-bold mb-2'>My Profile</h1>
                <p className='text-xl text-blue-300 mb-6'>Welcome, {user?.firstName}!</p>

                {/**Wallet Balance */}
                <div className='bg-gray-800 p-6 rounded-lg mb-8'>
                    <h2 className='text-2xl font-semibold'>Wallet Balance</h2>
                    <p className='text-4xl font-bold text-green-400'>${user?.profile?.walletBalance.toLocaleString()}</p>
                </div>

                {/**Active Bets */}
                <div className='mb-8'>
                    <h2 className='text-2xl font-semibold mb-4'>Active Bets</h2>
                    {activeBets.length > 0 ? (
                        <div className='space-y-4'>
                            {activeBets.map(bet => (
                                <div key={bet.id} className='bg-gray-800 p-4 rounded-lg'>
                                    <p className='font-bold text-lg'>{bet.game.awayTeam} @ {bet.game.homeTeam}</p>
                                    <p className='font-bold text-lg'>{bet.game.awayScore} - {bet.game.homeScore}</p>
                                    <p className='text-green-400 mt-2'>Amount: ${bet.amount}</p>
                                </div>
                            ))}
                        </div>
                    ) : <p>No Active Bets</p>}
                </div>

                {/**Past Bets */}
                <h2 className='text-2xl font-semibold mb-4'>Past Bets</h2>
                    {pastBets.length > 0 ? (
                        <div className='space-y-4'>
                            {pastBets.map(bet => (
                                <div key={bet.id} className='bg-gray-800 p-4 rounded-lg'>
                                    <p className='font-bold text-lg'>{bet.game.awayTeam} @ {bet.game.homeTeam}</p>
                                    <p className='font-bold text-lg'>{bet.game.awayScore} - {bet.game.homeScore}</p>
                                    <p className='text-green-400 mt-2'>Result: ${bet.amount}</p>
                                </div>
                            ))}
                        </div>
                    ) : <p>No Past Bets</p>}
            </div>
        </div>
    );
};

export default ProfilePage;