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
      // 从 SecureStorage 获取 token
      const token = SecureStorage.getItem(AUTH_KEY);
      const isValid = validateToken(token);
      setIsAuthenticated(isValid);

      if (isValid && token) {
        try {
          // 解密 token 并获取用户名
          const decryptedToken = decrypt(token);
          const decoded = atob(decryptedToken);
          const extractedUsername = decoded.split('_')[0];
          setUsername(extractedUsername);
        } catch {
          setUsername(null);
          setIsAuthenticated(false);
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
