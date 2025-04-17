import { SecureStorage } from './secure-storage'
import { encrypt, decrypt } from './crypto'

// 声明全局环境变量类型
declare global {
  interface Window {
    env?: {
      NEXT_PUBLIC_ENV: string
      NEXT_PUBLIC_SECURE_COOKIE: string
    }
  }
}

// 加密存储的用户凭证
export const AUTH_CREDENTIALS = [
  {
    username: 'S1ZQAgAJBktUWQg=', // 158
    password: 'AAAAAQEJBk5bWgEDAAw=', // zch158
  },
  {
    username: 'S1BfCAcEAk1VWgQ=', // 137
    password: 'FlJbBwwCAUxUXgIA', // l137
  },
  {
    username: 'S1ZfAwwJAU9RXAY', // 157
    password: 'AA5ZBQMCDEJWXQIABw==', // zm157
  },
]

// localStorage和cookie的key
export const AUTH_KEY = 'auth_token'

// 获取环境变量的安全方法
const getEnvVar = (key: string): string => {
  return typeof window !== 'undefined'
    ? window?.__NEXT_DATA__?.props?.pageProps?.[key] || process.env[key]
    : process.env[key]
}

// 验证用户凭证
export function verifyCredentials(inputUsername: string, inputPassword: string): boolean {
  return AUTH_CREDENTIALS.some((cred) => {
    try {
      const decryptedUsername = decrypt(cred.username)
      const decryptedPassword = decrypt(cred.password)
      return decryptedUsername === inputUsername && decryptedPassword === inputPassword
    } catch {
      return false
    }
  })
}

// 生成token时进行加密
export function generateToken(username: string): string {
  const token = btoa(`${username}_${Date.now()}`)
  return encrypt(token)
}

// 验证token时先解密
export function validateToken(token: string | null): boolean {
  if (!token) return false
  try {
    const decryptedToken = decrypt(token)
    const decoded = atob(decryptedToken)
    
    // 从解密后的token中提取用户名
    const username = decoded.split('_')[0]
    
    // 检查用户名是否有效
    return AUTH_CREDENTIALS.some((cred) => {
      try {
        const decryptedUsername = decrypt(cred.username)
        return username === decryptedUsername
      } catch {
        return false
      }
    })
  } catch {
    return false
  }
}

// 保存认证信息
export function saveAuth(token: string) {
  if (typeof window !== 'undefined') {
    try {
      // 保存到 SecureStorage
      SecureStorage.setItem(AUTH_KEY, token)

      // 从环境变量获取是否设置 Secure 标志
      const shouldSetSecure = getEnvVar('NEXT_PUBLIC_SECURE_COOKIE') === 'true'
      const currentEnv = getEnvVar('NEXT_PUBLIC_ENV')

      // 设置 cookie 选项
      const cookieOptions = {
        path: '/',
        maxAge: 86400,
        sameSite: 'Lax' as const,
        secure: shouldSetSecure,
      }

      // 构建 cookie 字符串
      const cookieString = `${AUTH_KEY}=${token}; path=${cookieOptions.path}; max-age=${cookieOptions.maxAge}; SameSite=${cookieOptions.sameSite}${cookieOptions.secure ? '; Secure' : ''}`

      // 输出调试信息
      console.log('Cookie settings:', {
        environment: currentEnv,
        secure: cookieOptions.secure,
      })

      document.cookie = cookieString
      console.log('Auth saved successfully')
    } catch (error) {
      console.error('Error saving auth:', error)
      throw error
    }
  }
}

// 清除认证
export function clearAuth() {
  if (typeof window !== 'undefined') {
    SecureStorage.removeItem(AUTH_KEY)
    document.cookie = `${AUTH_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  }
}
