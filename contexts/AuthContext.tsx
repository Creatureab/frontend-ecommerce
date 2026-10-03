'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { apiClient } from '@/lib/api-client';
import { authApi, type ProfileUpdatePayload, type RegisterPayload } from '@/features/auth/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterPayload) => Promise<void>;
  updateProfile: (payload: ProfileUpdatePayload) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    queueMicrotask(() => {
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        apiClient.setToken(storedToken);
      }
      setIsLoading(false);
    });
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);

      if (response.success && response.data) {
        // Backend returns: { success: true, data: { user: {...}, token: "..." } }
        const userData = response.data.user;
        const userToken = response.data.token;
        
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        apiClient.setToken(userToken);
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterPayload) => {
    try {
      const response = await authApi.register(userData);

      if (response.success) {
        // Backend returns: { success: true, data: user, token: "..." }
        const newUser = response.data;
        const userToken = response.token;

        setUser(newUser);
        setToken(userToken);
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        apiClient.setToken(userToken);
      }
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (payload: ProfileUpdatePayload) => {
    const response = await authApi.updateProfile(payload);
    if (response.data) {
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    apiClient.clearToken();
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    updateProfile,
    logout,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
