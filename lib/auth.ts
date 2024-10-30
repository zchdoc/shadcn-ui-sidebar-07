import { SecureStorage } from './secure-storage';
import { encrypt, decrypt } from './crypto';
// 预设的用户名和密码
export const AUTH_CREDENTIALS = {
  username: '15824821718',
  password: 'zch15824821718'
};
// localStorage和cookie的key
export const AUTH_KEY = 'auth_token';

// 生成token时进行加密
export function generateToken(username: string): string {
  const token = btoa(`${username}_${Date.now()}`);
  return encrypt(token);
}

// 验证token时先解密
export function validateToken(token: string | null): boolean {
  if (!token) return false;
  try {
    const decryptedToken = decrypt(token);
    const decoded = atob(decryptedToken);
    return decoded.startsWith(AUTH_CREDENTIALS.username);
  } catch {
    return false;
  }
}

// 保存认证信息
export function saveAuth(token: string) {
  if (typeof window !== 'undefined') {
    // 使用 try-catch 包装存储操作
    try {
      SecureStorage.setItem(AUTH_KEY, token);
      document.cookie = `${AUTH_KEY}=${token}; path=/; max-age=86400; Secure; SameSite=Strict`;
      console.log('Auth saved successfully');
    } catch (error) {
      console.error('Error saving auth:', error);
    }
  }
}

// 清除认证
export function clearAuth() {
  if (typeof window !== 'undefined') {
    SecureStorage.removeItem(AUTH_KEY);
    document.cookie = `${AUTH_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}
