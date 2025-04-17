// lib/employee-mapping.ts
import { decrypt } from './crypto'

// 加密的用户名映射常量
const ENCRYPTED_USERNAMES = {
  USER1: 'S1ZQAgAJBktUWQg=', // z
  USER2: 'S1BfCAcEAk1VWgQ=', // l
  USER3: 'S1ZfAwwJAU9RXAY', // zm
}

// 用户名到员工ID的映射表 - 使用函数调用以避免在代码中出现明文
const USER_EMPLOYEE_MAPPING: Record<string, string> = {
  [decrypt(ENCRYPTED_USERNAMES.USER1)]: '3000002',
  [decrypt(ENCRYPTED_USERNAMES.USER2)]: '5000001',
  [decrypt(ENCRYPTED_USERNAMES.USER3)]: '4000003',
}

// 加密用户名到员工ID的直接映射
const ENCRYPTED_USER_EMPLOYEE_MAPPING: Record<string, string> = {
  [ENCRYPTED_USERNAMES.USER1]: '3000002',
  [ENCRYPTED_USERNAMES.USER2]: '5000001',
  [ENCRYPTED_USERNAMES.USER3]: '4000003',
}

// 默认的员工ID
const DEFAULT_EMPLOYEE_ID = '0000000'

/**
 * 根据用户名获取对应的员工ID
 * @param username 用户名
 * @returns 员工ID
 */
export function getEmployeeIdByUsername(username?: string | null): string {
  // console.log('getEmployeeIdByUsername called with username:', username);
  if (!username) return DEFAULT_EMPLOYEE_ID
  return USER_EMPLOYEE_MAPPING[username] || DEFAULT_EMPLOYEE_ID
}

/**
 * 根据加密的用户名获取对应的员工ID
 * @param encryptedUsername 加密的用户名
 * @returns 员工ID
 */
export function getEmployeeIdByEncryptedUsername(encryptedUsername?: string | null): string {
  if (!encryptedUsername) return DEFAULT_EMPLOYEE_ID
  return ENCRYPTED_USER_EMPLOYEE_MAPPING[encryptedUsername] || DEFAULT_EMPLOYEE_ID
}

// 导出常量以便其他地方可能需要使用
export { DEFAULT_EMPLOYEE_ID, ENCRYPTED_USERNAMES }
