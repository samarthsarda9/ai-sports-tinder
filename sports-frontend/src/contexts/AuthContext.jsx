import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

// Holds authentication data
const AuthContext = createContext();

// Hook to access authentication state and functions
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context;
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    axios.defaults.baseURL = 'http://localhost:8080/api';

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchUser = async () => {
            if (token && token.trim() != '') {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    const userResponse = await axios.get('/users/me');
                    setUser(userResponse.data);
                    setIsAuthenticated(true);
                } catch (error) {
                    logout();
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('/auth/login', { email, password });
            const { token } = response.data;

            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const userResponse = await axios.get('/users/me');
            setUser(userResponse.data);
            setIsAuthenticated(true);
            return { success : true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post('/auth/signup', userData);
            return { success: true, data: response.data };
        } catch (error) {
            console.error ('Registration error: ', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.response?.data?.error || error.message || 'Registration failed'
            };
        }
    };

    const verify = async (email, verificationCode) => {
        try {
            const response = await axios.post('/auth/verify', { email, verificationCode });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Verification failed'
            }
        }
    }

    const resendVerificationEmail = async (email) => {
        try {
            const response = await axios.post('/auth/resend', null, {
                params: { email }
            });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data.message || 'Failed to resend verification code'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user, 
        isAuthenticated,
        loading,
        login,
        register,
        verify,
        resendVerificationEmail,
        setUser,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};