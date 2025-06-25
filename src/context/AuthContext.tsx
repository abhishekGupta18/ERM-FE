import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (userData: any) => Promise<void>;
    logout: () => void;
    loading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                try {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));

                    // Verify token is still valid
                    await apiService.getProfile();
                } catch (error) {
                    // Token is invalid, clear storage
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await apiService.login({ email, password });
            if (response.success && response.data) {
                const { token: newToken, user: userData } = response.data;

                localStorage.setItem('token', newToken);
                localStorage.setItem('user', JSON.stringify(userData));

                setToken(newToken);
                setUser(userData);
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error: any) {
            throw new Error(error.message || 'Login failed');
        }
    };

    const signup = async (userData: any) => {
        try {
            const response = await apiService.signup(userData);
            if (response.success && response.data) {
                const { token: newToken, user: newUser } = response.data;

                localStorage.setItem('token', newToken);
                localStorage.setItem('user', JSON.stringify(newUser));

                setToken(newToken);
                setUser(newUser);
            } else {
                throw new Error(response.message || 'Signup failed');
            }
        } catch (error: any) {
            throw new Error(error.message || 'Signup failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        token,
        login,
        signup,
        logout,
        loading,
        isAuthenticated: !!token && !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 