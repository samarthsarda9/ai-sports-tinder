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
    const [activeIndex, setActiveIndex] = useState(0);
    const [pastIndex, setPastIndex] = useState(0);

    const scrollActive = (delta) => {
        setActiveIndex((prev) => {
            const next = Math.min(Math.max(prev + delta, 0), Math.max(activeBets.length - 1, 0));
            return next;
        });
    };

    const scrollPast = (delta) => {
        setPastIndex((prev) => {
            const next = Math.min(Math.max(prev + delta, 0), Math.max(pastBets.length - 1, 0));
            return next;
        });
    };

    const goBackToHome = () => {
        navigate('/');
    }

    return (
        <div className='min-h-screen text-white p-4'>
            <div className='container-app relative'>
                <button onClick={goBackToHome} className="btn btn-outline absolute left-0 top-0 px-3 py-1">
                    <ArrowLeft size={18} className='mr-1'/>
                    <span>Home</span>
                </button>
                <h1 className='text-3xl font-bold mb-2'>My Profile</h1>
                <p className='text-xl text-blue-300 mb-6'>Welcome, {user?.firstName}!</p>

                {/**Wallet Balance */}
                <div className='card p-6 mb-8'>
                    <h2 className='text-2xl font-semibold'>Wallet Balance</h2>
                    <p className='text-4xl font-bold text-green-400'>${user?.profile?.walletBalance.toLocaleString()}</p>
                </div>

                {/**Active Bets */}
                <div className='mb-8'>
                    <div className='flex items-center justify-between mb-4'>
                        <h2 className='text-2xl font-semibold'>Active Bets</h2>
                        {activeBets.length > 1 && (
                            <div className='flex gap-2'>
                                <button onClick={() => scrollActive(-1)} className='btn btn-outline px-3 py-1'>Prev</button>
                                <button onClick={() => scrollActive(1)} className='btn btn-outline px-3 py-1'>Next</button>
                            </div>
                        )}
                    </div>
                    {activeBets.length > 0 ? (
                        <div className='space-y-4'>
                            <div className='bg-gray-800/70 border border-white/10 p-4 rounded-lg'>
                                <p className='font-bold text-lg'>{activeBets[activeIndex].game.awayTeam} @ {activeBets[activeIndex].game.homeTeam}</p>
                                <p className='font-bold text-lg'>{activeBets[activeIndex].game.awayScore} - {activeBets[activeIndex].game.homeScore}</p>
                                <p className='text-green-400 mt-2'>Amount: ${activeBets[activeIndex].amount}</p>
                                <p className='text-gray-300 mt-1'>Status: {activeBets[activeIndex].status}</p>
                            </div>
                            <div className='text-sm text-white/70'>
                                {activeIndex + 1} / {activeBets.length}
                            </div>
                        </div>
                    ) : <p>No Active Bets</p>}
                </div>

                {/**Past Bets */}
                <h2 className='text-2xl font-semibold mb-4'>Past Bets</h2>
                {pastBets.length > 0 ? (
                    <div className='space-y-4'>
                        <div className='flex items-center justify-between'>
                            {pastBets.length > 1 && (
                                <div className='flex gap-2'>
                                    <button onClick={() => scrollPast(-1)} className='btn btn-outline px-3 py-1'>Prev</button>
                                    <button onClick={() => scrollPast(1)} className='btn btn-outline px-3 py-1'>Next</button>
                                </div>
                            )}
                        </div>
                        <div className='bg-gray-800/70 border border-white/10 p-4 rounded-lg'>
                            <p className='font-bold text-lg'>{pastBets[pastIndex].game.awayTeam} @ {pastBets[pastIndex].game.homeTeam}</p>
                            <p className='font-bold text-lg'>{pastBets[pastIndex].game.awayScore} - {pastBets[pastIndex].game.homeScore}</p>
                            <p className='text-green-400 mt-2'>Result: ${pastBets[pastIndex].amount}</p>
                            <p className='text-gray-300 mt-1'>Status: {pastBets[pastIndex].status}</p>
                        </div>
                        <div className='text-sm text-white/70'>
                            {pastIndex + 1} / {pastBets.length}
                        </div>
                    </div>
                ) : <p>No Past Bets</p>}
            </div>
        </div>
    );
};

export default ProfilePage;