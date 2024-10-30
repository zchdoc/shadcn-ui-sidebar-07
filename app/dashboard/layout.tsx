"use client"

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { SecureStorage } from '@/lib/secure-storage';
import { validateToken } from '@/lib/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // 使用单次检查标志，避免重复检查
    let isChecking = false;

    const checkAuth = () => {
      if (isChecking) return;
      isChecking = true;

      const token = SecureStorage.getItem('auth_token');
      console.log('Dashboard Layout - Token check:', token ? 'exists' : 'missing');

      if (!isAuthenticated || !validateToken(token)) {
        console.log('Dashboard Layout - Redirecting to login');
        // 使用 setTimeout 避免立即重定向
        setTimeout(() => {
          router.replace('/login');
        }, 100);
      }

      isChecking = false;
    };

    // 只在组件挂载时检查一次
    checkAuth();

    // 清理函数
    return () => {
      isChecking = false;
    };
  }, [isAuthenticated, router]);

  // 如果已认证，直接渲染内容
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // 未认证时显示加载状态，避免闪烁
  return (
    <div className="flex items-center justify-center min-h-screen">
      Loading...
    </div>
  );
}