import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { Mail, Lock, LogIn } from 'lucide-react'

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen text-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-brand-300">Welcome Back</h1>
                    <p className="text-gray-400">Sign in to get your AI-powered picks!</p>
                </div>

                <form onSubmit={handleSubmit} className="card p-8 space-y-6">
                    {error && (
                        <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email Address"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-gray-800/60 border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-gray-400 text-white"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-gray-800/60 border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-gray-400 text-white"
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full py-3 px-4 flex items-center justify-center"
                    >
                        {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <LogIn className="mr-2" size={20} />}
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>

                    <div className="text-center" >
                        <Link to="/register" className="text-brand-300 hover:text-brand-200 transition-colors">
                            Don't have an account? Sign Up!
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;