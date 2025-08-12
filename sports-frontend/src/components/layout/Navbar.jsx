import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { DollarSign, LogOut, User, Trophy, Menu as MenuIcon, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <header className="sticky top-0 z-40 bg-white/10 backdrop-blur-lg border-b border-white/10">
            <div className="container-app h-14 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-white font-semibold">
                    <Trophy className="w-5 h-5 text-yellow-300" />
                    <span>BetSwipe</span>
                </Link>

                <nav className="hidden sm:flex items-center gap-3">
                    {isAuthenticated ? (
                        <>
                            <Link to="/" className={`transition-colors ${location.pathname === '/' ? 'text-white font-semibold' : 'text-white/80 hover:text-white'}`}>Betting Cards</Link>
                            <div className="bg-white/20 rounded-full px-3 py-1 hidden md:flex items-center gap-1">
                                <DollarSign className="w-4 h-4 text-yellow-300" />
                                <span className="font-semibold">{(user?.profile?.walletBalance ?? 0).toLocaleString()}</span>
                            </div>
                            <Link to="/profile" className={`btn px-3 py-1 ${location.pathname === '/profile' ? 'btn-primary' : 'btn-outline'}`}>
                                <User className="w-4 h-4 mr-1" /> Profile
                            </Link>
                            <button onClick={handleLogout} className="btn btn-outline px-3 py-1">
                                <LogOut className="w-4 h-4 mr-1" /> Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="btn btn-outline px-3 py-1">Login</Link>
                            <Link to="/register" className="btn btn-primary px-3 py-1">Register</Link>
                        </div>
                    )}
                </nav>

                <button onClick={() => setOpen(!open)} className="sm:hidden text-white/90 hover:text-white">
                    {open ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile menu */}
            <div className={`sm:hidden border-t border-white/10 overflow-hidden transition-[max-height] duration-300 ease-out ${open ? 'max-h-96' : 'max-h-0'}`}>
                <div className="container-app py-3 space-y-3">
                    {isAuthenticated ? (
                        <>
                            <Link to="/" onClick={() => setOpen(false)} className="block text-white/80 hover:text-white">Betting Cards</Link>
                            <div className="bg-white/20 rounded-full px-3 py-1 inline-flex items-center gap-1">
                                <DollarSign className="w-4 h-4 text-yellow-300" />
                                <span className="font-semibold">{(user?.profile?.walletBalance ?? 0).toLocaleString()}</span>
                            </div>
                            <div className="flex gap-2">
                                <Link to="/profile" onClick={() => setOpen(false)} className="btn btn-outline flex-1 py-2">Profile</Link>
                                <button onClick={handleLogout} className="btn btn-outline flex-1 py-2">Logout</button>
                            </div>
                        </>
                    ) : (
                        <div className="flex gap-2">
                            <Link to="/login" onClick={() => setOpen(false)} className="btn btn-outline flex-1 py-2">Login</Link>
                            <Link to="/register" onClick={() => setOpen(false)} className="btn btn-primary flex-1 py-2">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;