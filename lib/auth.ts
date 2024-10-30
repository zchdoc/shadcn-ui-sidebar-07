// 预设的用户名和密码
export const AUTH_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// localStorage key
export const AUTH_KEY = 'auth_token';

// 简单的token生成
export function generateToken(username: string): string {
  return btoa(`${username}_${Date.now()}`);
}

// 验证token
export function validateToken(token: string | null): boolean {
  if (!token) return false;
  try {
    const decoded = atob(token);
    return decoded.startsWith(AUTH_CREDENTIALS.username);
  } catch {
    return false;
  }
}

// 清除认证
export function clearAuth() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
  }
}