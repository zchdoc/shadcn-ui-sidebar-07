"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { AUTH_CREDENTIALS, saveAuth, generateToken, validateToken } from "@/lib/auth"
import { useAuth } from "@/components/auth-provider"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { SecureStorage } from "@/lib/secure-storage"
import { decrypt, encrypt } from "@/lib/crypto"
import AuthenticationPage from "@/components/authentication/auth-index";

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { setIsAuthenticated } = useAuth()

  // 检查是否已经登录
  useEffect(() => {
    // NBkLCXZ5WBg5PQRBcFovKw53dWJ2KTUDZgRFASoKGFNSWgFONwJhbnIEClU+V1h5
    const token = SecureStorage.getItem("auth_token")
    console.log("Token:", token) // 调试日志
    if (token !== null && token !== undefined) {
      const decryptedToken = decrypt(token)
      console.log("Decrypted token:", decryptedToken)
      const encryptToken = encrypt(decryptedToken)
      console.log("Encrypt token:", encryptToken)
    }

    if (validateToken(token)) {
      const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard"
      router.push(callbackUrl)
    }
  }, [router, searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      if (username === AUTH_CREDENTIALS.username && password === AUTH_CREDENTIALS.password) {
        const token = generateToken(username);
        
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
        console.log("Invalid credentials") // 调试日志
        toast({
          title: "登录失败",
          description: "用户名或密码错误",
          variant: "destructive",
        })
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "错误",
          description: "登录过程中发生错误",
          variant: "destructive",
        })
      } else {
        alert(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthenticationPage/>
  )
}
