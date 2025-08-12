import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { Mail, User, Lock, LogIn } from 'lucide-react'

const Register = () => {
    const[formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: ''
    }); 

    const[loading, setLoading] = useState(false);
    const[error, setError] = useState('');
    const[success, setSuccess] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(false);
        setError('');

        if(!validateForm()) {
            setLoading(false);
            return;
        }

        const userData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            username: formData.username,
            password: formData.password
        };

        const result = await register (userData);

        if (result.success) {
            setSuccess('Registration Successful! Please check your email for your verification code.');
            setTimeout(() => {
                navigate(`/verify?email=${encodeURIComponent(formData.email)}`);
            }, 500);
        } else {
            setError(result.error);
        }
        setLoading(false);
    }

    return (
        <div className='min-h-screen text-white flex items-center justify-center p-4'>
            <div className='w-full max-w-md'>
                <div className='text-center mb-8'>
                    <h1 className="text-4xl font-bold text-brand-400">Sign Up</h1>
                </div>

                <form onSubmit={handleSubmit} className='card p-8 space-y-6'>
                    {error && (
                        <div className='bg-red-500/20 text-red-300 p-3 rounded-lg text-center'>
                            {error}
                        </div>
                    )}

                    <div className='relative'>
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            name='firstName'
                            id='firstName'
                            placeholder='First Name'
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full bg-gray-800/60 border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-gray-400 text-white"
                        />
                    </div>

                    <div className='relative'>
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            name='lastName'
                            id='lastName'
                            placeholder='Last Name'
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full bg-gray-800/60 border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-gray-400 text-white"
                        />
                    </div>

                    <div className='relative'>
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            name='username'
                            id='username'
                            placeholder='Username'
                            required
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full bg-gray-800/60 border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-gray-400 text-white"
                        />
                    </div>

                    <div className='relative'>
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type='email'
                            name='email'
                            id='email'
                            placeholder='Email'
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-gray-800/60 border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-gray-400 text-white"
                        />
                    </div>

                    <div className='relative'>
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type='password'
                            name='password'
                            id='password'
                            placeholder='Password'
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-gray-800/60 border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-gray-400 text-white"
                        />
                    </div>

                    <button 
                        type='submit'
                        disabled={loading}
                        className="btn btn-primary w-full py-3 px-4 flex items-center justify-center"
                        >
                            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <LogIn className="mr-2" size={20} />}
                            {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>

                    <div className="text-center" >
                        <Link to="/login" className="text-brand-400 hover:text-brand-300 transition-colors">
                            Already have an account? Sign in!
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;