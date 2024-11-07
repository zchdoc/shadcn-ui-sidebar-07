"use client";

import * as React from "react";
import {useRouter, useSearchParams} from "next/navigation";

import {cn} from "@/lib/utils";
import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useToast} from "@/components/ui/use-toast";
import {AUTH_CREDENTIALS, generateToken, saveAuth, validateToken} from "@/lib/auth";
import {useAuth} from "@/components/auth-provider";
import {SecureStorage} from "@/lib/secure-storage";
import {decrypt, encrypt} from "@/lib/crypto";
import Link from "next/link";

interface UserLoginFormProps extends React.HTMLAttributes<HTMLDivElement> {
}

export function UserLoginForm({className, ...props}: UserLoginFormProps) {
  const {setIsAuthenticated} = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {toast} = useToast();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
  });

  // 检查是否已经登录
  React.useEffect(() => {
    const token = SecureStorage.getItem("auth_token");
    console.log("Token:", token); // 调试日志

    if (token !== null && token !== undefined) {
      const decryptedToken = decrypt(token);
      console.log("Decrypted token:", decryptedToken);
      const encryptToken = encrypt(decryptedToken);
      console.log("Encrypt token:", encryptToken);
    }

    if (validateToken(token)) {
      const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
      router.push(callbackUrl);
    }
  }, [router, searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (
        formData.username === AUTH_CREDENTIALS.username &&
        formData.password === AUTH_CREDENTIALS.password
      ) {
        const token = generateToken(formData.username);

        // 先保存认证信息
        await saveAuth(token);

        // 确保认证状态更新
        setIsAuthenticated(true);

        // 等待一个短暂的延时以确保状态更新完成
        await new Promise(resolve => setTimeout(resolve, 100));

        const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard';

        // 使用 replace 而不是 push
        router.replace(callbackUrl);

        toast({
          title: "登录成功",
          description: "正在跳转到主页面...",
        });
      } else {
        console.log("Invalid credentials"); // 调试日志
        toast({
          title: "登录失败",
          description: "用户名或密码错误",
          variant: "destructive",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "错误",
          description: "登录过程中发生错误",
          variant: "destructive",
        });
      } else {
        alert(error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Login to your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials below to login
        </p>
      </div>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="Enter your username"
              type="text"
              autoCapitalize="none"
              autoComplete="username"
              autoCorrect="off"
              disabled={isLoading}
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              placeholder="Enter your password"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              disabled={isLoading}
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
            )}
            Login
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"/>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4"/>
        )}{" "}
        GitHub
      </Button>
      <p className="px-8 text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <Link
          href="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}