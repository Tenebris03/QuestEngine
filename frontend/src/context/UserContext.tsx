import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export interface UserStats {
  strength: number;
  agility: number;
  intelligence: number;
  vitality: number;
}

export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  profilePicture?: string;
  level: number;
  experience: number;
  maxExperience: number;
  stats: UserStats;
  createdAt: string;
  updatedAt: string;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<boolean>;
  updateUser: (updates: Partial<User>) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { access_token, user: userData } = response.data;
      localStorage.setItem('token', access_token);
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const register = useCallback(async (email: string, password: string, firstName?: string, lastName?: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, { email, password, firstName, lastName });
      console.log('Registered:', response.data);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  return (
    <UserContext.Provider value={{ user, isAuthenticated, login, logout, register, updateUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
