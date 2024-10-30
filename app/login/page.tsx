"use client"

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AUTH_CREDENTIALS, saveAuth, generateToken, validateToken } from '@/lib/auth';
import { useAuth } from '@/components/auth-provider';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { setIsAuthenticated } = useAuth();

  // 检查是否已经登录
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (validateToken(token)) {
      const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
      router.replace(callbackUrl);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (username === AUTH_CREDENTIALS.username && password === AUTH_CREDENTIALS.password) {
        const token = generateToken(username);
        saveAuth(token);
        setIsAuthenticated(true);
        
        toast({
          title: "Success",
          description: "Login successful! Redirecting...",
        });

        const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
        
        // 使用 setTimeout 确保 toast 消息能够显示
        setTimeout(() => {
          router.replace(callbackUrl);
        }, 1000);
      } else {
        toast({
          title: "Error",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}