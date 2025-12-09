import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useTheme } from './ThemeContext';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  theme?: 'light' | 'dark';
  language?: 'es' | 'en';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setLanguage, toggleTheme, theme } = useTheme();

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Credenciales de prueba
    if (email === 'admin@tranvia.cuenca.ec' && password === 'admin123') {
      const adminUser = {
        id: '1',
        name: 'Administrador',
        email: 'admin@tranvia.cuenca.ec',
        role: 'admin' as const,
        theme: 'dark' as const,
        language: 'es' as const
      };
      
      // Aplicar configuraciones del usuario
      if (adminUser.theme !== theme) {
        toggleTheme();
      }
      if (adminUser.language) {
        setLanguage(adminUser.language);
      }
      
      setUser(adminUser);
      setIsLoading(false);
      return true;
    } else if (email === 'usuario@example.com' && password === 'user123') {
      const regularUser = {
        id: '2',
        name: 'Juan Pérez',
        email: 'usuario@example.com',
        role: 'user' as const,
        theme: 'light' as const,
        language: 'es' as const
      };
      
      // Aplicar configuraciones del usuario
      if (regularUser.theme !== theme) {
        toggleTheme();
      }
      if (regularUser.language) {
        setLanguage(regularUser.language);
      }
      
      setUser(regularUser);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      id: Math.random().toString(),
      name,
      email,
      role: 'user' as const,
      theme: 'light' as const,
      language: 'es' as const
    };
    
    // Aplicar configuraciones del usuario
    if (newUser.theme !== theme) {
      toggleTheme();
    }
    if (newUser.language) {
      setLanguage(newUser.language);
    }
    
    setUser(newUser);
    
    setIsLoading(false);
    return true;
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