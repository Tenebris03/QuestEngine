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
  user: User;
  updateUser: (updates: Partial<User>) => void;
}

const defaultUser: User = {
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
  const [user, setUser] = useState<User>(defaultUser);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser }}>
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

