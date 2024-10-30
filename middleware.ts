import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { validateToken } from '@/lib/auth'
 
export function middleware(request: NextRequest) {
  // 排除登录页面和静态资源
  if (
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  const authToken = request.cookies.get('auth_token')?.value || 
                   request.headers.get('authorization')?.split(' ')[1]

  // 如果没有 token，检查 localStorage
  if (!authToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (!validateToken(authToken)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}