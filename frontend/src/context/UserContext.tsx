import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/authService';
import type { BackendUser } from '../services/authService';

export interface UserStats {
  strength: number;
  agility: number;
  intelligence: number;
  vitality: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  level: number;
  experience: number;
  maxExperience: number;
  stats: UserStats;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  updateUser: (updates: Partial<User>) => void;
  gainRewards: (xpGain: number, statGains: Partial<UserStats>) => void;
}

const TOKEN_KEY = 'questengine_token';
const USER_KEY = 'questengine_user';

function mapBackendUser(backendUser: BackendUser): User {
  return {
    id: backendUser.id,
    name: backendUser.name,
    email: backendUser.email,
    profilePicture: backendUser.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${backendUser.name}`,
    level: backendUser.level,
    experience: backendUser.experience,
    maxExperience: backendUser.maxExperience,
    stats: {
      strength: backendUser.strength,
      agility: backendUser.agility,
      intelligence: backendUser.intelligence,
      vitality: backendUser.vitality,
    },
  };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    if (token && storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiLogin({ email, password });
      const mappedUser = mapBackendUser(response.user);

      localStorage.setItem(TOKEN_KEY, response.accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(mappedUser));

      setUser(mappedUser);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      await apiRegister({ name, email, password });
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const gainRewards = useCallback((xpGain: number, statGains: Partial<UserStats>) => {
    setUser((prev) => {
      if (!prev) return prev;

      let newXp = prev.experience + xpGain;
      let newLevel = prev.level;
      let newMaxXp = prev.maxExperience;

      while (newXp >= newMaxXp) {
        newXp -= newMaxXp;
        newLevel += 1;
        newMaxXp = Math.floor(newMaxXp * 1.2);
      }

      const updated = {
        ...prev,
        level: newLevel,
        experience: newXp,
        maxExperience: newMaxXp,
        stats: {
          strength: prev.stats.strength + (statGains.strength || 0),
          agility: prev.stats.agility + (statGains.agility || 0),
          intelligence: prev.stats.intelligence + (statGains.intelligence || 0),
          vitality: prev.stats.vitality + (statGains.vitality || 0),
        },
      };

      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, isAuthenticated, login, logout, register, updateUser, gainRewards }}>
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
