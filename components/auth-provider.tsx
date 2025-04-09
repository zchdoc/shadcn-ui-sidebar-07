'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AUTH_KEY, validateToken } from '@/lib/auth'
import { SecureStorage } from '@/lib/secure-storage'
import { decrypt } from '@/lib/crypto'

interface AuthContextType {
  isAuthenticated: boolean
  username: string | null
  setIsAuthenticated: (value: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      const token = SecureStorage.getItem(AUTH_KEY)
      const isValid = validateToken(token)

      // Avoid state updates if on login page and token is valid
      if (pathname === '/login' && isValid) {
        router.replace('/dashboard')
        setIsLoading(false)
        return
      }

      setIsAuthenticated(isValid)

      if (isValid && token) {
        try {
          const decryptedToken = decrypt(token)
          const decoded = atob(decryptedToken)
          const extractedUsername = decoded.split('_')[0]
          setUsername(extractedUsername)
        } catch (error) {
          console.error('Token decryption error:', error)
          setUsername(null)
          setIsAuthenticated(false)
        }
      } else {
        setUsername(null)
      }

      // Redirect if not authenticated and not on login page
      if (!isValid && pathname !== '/login') {
        router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`)
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, username, setIsAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
