import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { validateToken } from '@/lib/auth'

let isRedirecting = false

export function middleware(request: NextRequest) {
  // 如果已经在登录页面，且有有效token，重定向到dashboard
  if (request.nextUrl.pathname === '/login') {
    const authToken = request.cookies.get('auth_token')?.value
    if (authToken && validateToken(authToken)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // 排除静态资源和API路由
  if (request.nextUrl.pathname.startsWith('/_next') || request.nextUrl.pathname.startsWith('/api') || request.nextUrl.pathname.startsWith('/favicon')) {
    return NextResponse.next()
  }

  // 获取token
  const authToken = request.cookies.get('auth_token')?.value

  // 如果没有token或token无效，重定向到登录页
  if (!authToken || !validateToken(authToken)) {
    // 防止重定向循环
    if (isRedirecting) {
      return NextResponse.next()
    }

    isRedirecting = true
    setTimeout(() => {
      isRedirecting = false
    }, 100)

    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}
