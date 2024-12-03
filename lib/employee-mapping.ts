// lib/employee-mapping.ts

// 用户名到员工ID的映射表
const USER_EMPLOYEE_MAPPING: Record<string, string> = {
  "15824821718": "3000002",
  "13783567624": "5000001",
}

// 默认的员工ID
const DEFAULT_EMPLOYEE_ID = "0000000"

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

// 导出常量以便其他地方可能需要使用
export { DEFAULT_EMPLOYEE_ID }