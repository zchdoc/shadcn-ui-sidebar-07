import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 定义一个通用类型参数 T 来替代 any
export function debounce<T extends unknown[]>(
  func: (...args: T) => void,
  wait: number
) {
  let timeout: NodeJS.Timeout

  return function executedFunction(...args: T) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
