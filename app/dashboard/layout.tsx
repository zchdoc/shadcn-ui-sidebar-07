"use client"

import React, {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/components/auth-provider';
import {validateToken} from '@/lib/auth';

export default function DashboardLayout({
                                          children,
                                        }: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const {isAuthenticated} = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!isAuthenticated || !validateToken(token)) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  return <>{children}</>;
}
