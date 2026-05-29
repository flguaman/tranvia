import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useTheme, Theme, Language } from './ThemeContext';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  theme?: Theme;
  language?: Language;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (name: string, email: string, password: string) => Promise<User | null>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'admin@tranvia.cuenca.ec': {
    password: 'admin123',
    user: {
      id: '1',
      name: 'Administrador',
      email: 'admin@tranvia.cuenca.ec',
      role: 'admin',
      theme: 'dark',
      language: 'es',
    },
  },
  'usuario@example.com': {
    password: 'user123',
    user: {
      id: '2',
      name: 'Juan Pérez',
      email: 'usuario@example.com',
      role: 'user',
      theme: 'light',
      language: 'es',
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setLanguage, toggleTheme, theme } = useTheme();

  const applyUserPreferences = (nextUser: User) => {
    if (nextUser.theme && nextUser.theme !== theme) {
      toggleTheme();
    }
    if (nextUser.language) {
      setLanguage(nextUser.language);
    }
  };

  const authenticate = async (nextUser: User): Promise<User> => {
    applyUserPreferences(nextUser);
    setUser(nextUser);
    return nextUser;
  };

  const login = async (email: string, password: string): Promise<User | null> => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const demo = DEMO_USERS[email];
    if (demo && demo.password === password) {
      const loggedInUser = await authenticate(demo.user);
      setIsLoading(false);
      return loggedInUser;
    }

    setIsLoading(false);
    return null;
  };

  const register = async (
    name: string,
    email: string,
    _password: string
  ): Promise<User | null> => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newUser: User = {
      id: Math.random().toString(),
      name,
      email,
      role: 'user',
      theme: 'light',
      language: 'es',
    };

    const loggedInUser = await authenticate(newUser);
    setIsLoading(false);
    return loggedInUser;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
