"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AUTH_KEY, validateToken } from '@/lib/auth';
import { SecureStorage } from '@/lib/secure-storage';
import { decrypt } from '@/lib/crypto';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  setIsAuthenticated: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const token = SecureStorage.getItem(AUTH_KEY);
      console.log('AuthProvider - Checking token:', token);
      
      const isValid = validateToken(token);
      console.log('AuthProvider - Token valid:', isValid);
      
      setIsAuthenticated(isValid);
  
      if (isValid && token) {
        try {
          const decryptedToken = decrypt(token);
          const decoded = atob(decryptedToken);
          const extractedUsername = decoded.split('_')[0];
          setUsername(extractedUsername);
        } catch (error) {
          console.error('Token decryption error:', error);
          setUsername(null);
          setIsAuthenticated(false);
        }
      } else {
        setUsername(null);
      }
  
      // 只在非登录页且未认证时重定向
      if (!isValid && pathname !== '/login') {
        const currentPath = pathname === '/' ? '/dashboard' : pathname;
        router.replace(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
      }
      
      setIsLoading(false);
    };
  
    checkAuth();
  }, [pathname, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, setIsAuthenticated }}>
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
