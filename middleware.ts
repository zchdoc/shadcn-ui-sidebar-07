import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateToken } from "@/lib/auth";

export function middleware(request: NextRequest) {
  // 排除静态资源和API路由
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  const authToken = request.cookies.get("auth_token")?.value;
  const isValidToken = authToken && validateToken(authToken);

  // 处理登录页面的逻辑
  if (request.nextUrl.pathname === "/login") {
    if (isValidToken) {
      // 获取之前尝试访问的页面路径
      const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
      // 如果有之前的路径，就重定向到那里，否则重定向到首页
      if (callbackUrl && callbackUrl !== "/login") {
        return NextResponse.redirect(new URL(callbackUrl, request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 如果用户未登录，重定向到登录页面
  if (!isValidToken) {
    const loginUrl = new URL("/login", request.url);
    // 保存当前尝试访问的路径
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 已登录用户可以访问任何页面，保持在当前页面
  return NextResponse.next();
}

// 配置需要中间件处理的路径
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
