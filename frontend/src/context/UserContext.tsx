import React, { createContext, useContext, useState, useCallback } from 'react';

export interface UserStats {
  strength: number;
  agility: number;
  intelligence: number;
  vitality: number;
}

export interface User {
  name: string;
  profilePicture: string;
  level: number;
  experience: number;
  maxExperience: number;
  stats: UserStats;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  register: (username: string, email: string, password: string) => boolean;
  updateUser: (updates: Partial<User>) => void;
}

const mockUser: User = {
  name: 'ShadowWalker',
  profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ShadowWalker',
  level: 12,
  experience: 3450,
  maxExperience: 5000,
  stats: {
    strength: 18,
    agility: 24,
    intelligence: 15,
    vitality: 20,
  },
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = useCallback((username: string, password: string): boolean => {
    if (username === 'admin' && password === 'admin123') {
      setUser(mockUser);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const register = useCallback((username: string, email: string, password: string): boolean => {
    // Dummy-Registrierung ohne Backend – immer erfolgreich
    console.log('Registered:', { username, email, password });
    return true;
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  return (
    <UserContext.Provider value={{ user, isAuthenticated, login, logout, register, updateUser }}>
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

