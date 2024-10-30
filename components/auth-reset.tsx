"use client"

import { Button } from "@/components/ui/button"
import { clearAuth } from "@/lib/auth"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

export function AuthReset() {
  const { setIsAuthenticated } = useAuth()
  const router = useRouter()

  const handleReset = () => {
    clearAuth()
    setIsAuthenticated(false)
    router.push('/login')
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleReset}
      className="gap-2"
    >
      Reset Auth
    </Button>
  )
}