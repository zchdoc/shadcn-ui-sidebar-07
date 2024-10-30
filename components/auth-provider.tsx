"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AUTH_KEY, validateToken } from '@/lib/auth';

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
      const token = localStorage.getItem(AUTH_KEY);
      const isValid = validateToken(token);
      setIsAuthenticated(isValid);

      if (isValid && token) {
        try {
          // 从 token 中解析用户名
          const decoded = atob(token);
          const extractedUsername = decoded.split('_')[0];
          setUsername(extractedUsername);
        } catch {
          setUsername(null);
        }
      } else {
        setUsername(null);
      }

      // 如果在非登录页面且未认证，重定向到登录页
      if (!isValid && pathname !== '/login') {
        router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      }
      setIsLoading(false);
    };

    checkAuth();

    // 监听存储变化
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === AUTH_KEY) {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [pathname]);

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
