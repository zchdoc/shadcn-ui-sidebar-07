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
    // NBkLCXZ5WBg5PQRBcFovKw53dWJ2KTUDZgRFASoKGFNSAnYNNyxTbntlPFQLcVh5
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="w-[380px] backdrop-blur-sm bg-white/10 border-white/20">
          <CardHeader className="space-y-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">系统登录</CardTitle>
              <CardDescription className="text-gray-400">请输入您的账号和密码登录系统</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Input type="text" placeholder="请输入用户名" value={username} onChange={(e) => setUsername(e.target.value)} disabled={isLoading} autoComplete="username" className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-400" />
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Input type="password" placeholder="请输入密码" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} autoComplete="current-password" className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-400" />
                  </motion.div>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>登录中...</span>
                    </div>
                  ) : (
                    "登 录"
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
      {/* 装饰性背景光效 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        <div className="absolute inset-x-0 -bottom-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-bottom-80">
          <div className="relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+30rem)] sm:w-[72.1875rem]" />
        </div>
      </div>
    </div>
  )
}
