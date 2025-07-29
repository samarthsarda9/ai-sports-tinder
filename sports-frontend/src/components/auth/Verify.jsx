import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress
} from '@mui/material'
import { useAuth } from '../../contexts/AuthContext.jsx'

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
                navigate('/login');
            }, 2000);
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
        setResentLoading(true);
        setError('');
        setSuccess('');

        const result = await resendVerificationEmail(formData.email);

        if (result.success) {
            setSuccess('Verification code resent! Please check email');
        } else {
            setError(result.error);
        }
        setResentLoading(false);
    }

    return (
        <Container maxWidth='sm'>
            <Box 
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignContent: 'center'
                }}
            >
                <Paper 
                    elevation={3}
                    sx={{
                       padding: 4,
                       display: 'flex',
                       flexDirection: 'column',
                       alignItems: 'center',
                       width: '100%' 
                    }}
                >
                    <Typography component="h1" variant="h4" gutterBottom>
                        Verify Email
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
                        Please enter the veriifcation code sent to your email.
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                            {success}
                        </Alert>
                    )}

                    <Box component='form' onSubmit={handleVerify} sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="verificationCode"
                            label="Verification Code"
                            name="verificationCode"
                            value={formData.verificationCode}
                            onChange={handleChange}
                            placeholder="Enter 6-digit code"
                        />
                        <Button 
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Verify Email'}
                        </Button>

                        <Button 
                            fullWidth
                            variant="outlined"
                            onClick={handleResend}
                            disabled={resendLoading}
                            sx={{ mb: 2 }}
                        >
                            {resendLoading ? <CircularProgress size={24} /> : 'Resend Code'}
                        </Button>

                        <Box sx={{ textAlign: 'center' }}>
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <Typography variant="body2" color="primary">
                                    Back to Login
                                </Typography>
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}

export default Verify;