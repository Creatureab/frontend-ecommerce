'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { apiClient } from '@/lib/api-client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  userName: string;
  city: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string;
  phoneNumber: string;
  role?: 'admin' | 'user';
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
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      apiClient.setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post<{ success: boolean; message: string; data: { user: User; token: string } }>(
        '/auth/login',
        { email, password }
      );

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

  const register = async (userData: RegisterData) => {
    try {
      console.log("Sending registration data:", userData);
      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

      const response = await apiClient.post<{ success: boolean; message: string; data: User; token: string }>(
        '/auth/register',
        userData
      );

      console.log("Registration response:", response);

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
      console.error("Registration error:", error);
      throw error;
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
