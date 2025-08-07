import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { Check, LogIn, RefreshCcw } from 'lucide-react'

const Verify = () => {
    const[searchParams] = useSearchParams();
    const[formData, setFormData] = useState({
        email: '',
        verificationCode: ''
    });
    const[loading, setLoading] = useState(false);
    const[resendLoading, setResendLoading] = useState(false);
    const[error, setError] = useState('');
    const[success, setSuccess] = useState('');
    const { verify, resendVerificationEmail } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const emailFromUrl = searchParams.get('email');
        if (emailFromUrl) {
            setFormData(prev => ({
                ...prev,
                email: emailFromUrl
            }));
        }
    }, [searchParams]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(false);
        setError('');
        setSuccess('');

        const result = await verify(formData.email, formData.verificationCode);

        if (result.success) {
            setSuccess('Account Verified!');
            setTimeout(() => {
                navigate('/');
            }, 500);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const handleResend = async () => {
        if (!formData.email) {
            setError('Please enter your email address');
            return;
        }
        setResendLoading(true);
        setError('');
        setSuccess('');

        const result = await resendVerificationEmail(formData.email);

        if (result.success) {
            setSuccess('Verification code resent! Please check email');
        } else {
            setError(result.error);
        }
        setResendLoading(false);
    }

    return (
        <div className='min-h-screen bg-gray-900 text-white flex items-center justify-center p-4'>
            <div className='w-full max-w-md'>
                <div className='text-center mb-8'>
                    <h1 className="text-4xl font-bold text-blue-400">Email Verification</h1>
                    <p className='text-gray-400'>Please enter the verification code sent to your email</p>
                </div>

                <form onSubmit={handleVerify} className='bg-gray-800 p-8 rounded-2xl shadow-2xl space-y-6'>
                    {error && (
                        <div className='bg-red-500/20 text-red-300 p-3 rounded-lg text-center'>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className='bg-green-500/20 text-green-300 p-3 rounded-lg text-center'>
                            {success}
                        </div>
                    )}

                    <div className='relative'>
                        <Check className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            name='verificationCode'
                            id='verificationCode'
                            placeholder='Enter 6-digit code'
                            required
                            value={formData.verificationCode}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    <button 
                        type='submit'
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center disabled:bg-gray-500"
                    >
                            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <LogIn className="mr-2" size={20} />}
                            {loading ? 'Verifying...' : 'Verify'}
                    </button>
                    
                    <button
                        type='button'
                        disabled={resendLoading}
                        onClick={handleResend}
                        className="w-full bg-blue-900 hover:bg-blue-950 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center disabled:bg-gray-500"
                    >
                        {resendLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <RefreshCcw className="mr-2" size={20} />}
                        {resendLoading ? 'Resending...' : 'Resend Verification Code'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Verify;