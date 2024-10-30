// 预设的用户名和密码
export const AUTH_CREDENTIALS = {
  username: '15824821718',
  password: 'zch15824821718'
};

// localStorage和cookie的key
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

// 保存认证信息
export function saveAuth(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_KEY, token);
    document.cookie = `auth_token=${token}; path=/; max-age=86400`; // 24小时过期
  }
}

// 清除认证
export function clearAuth() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
    document.cookie = `auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}
