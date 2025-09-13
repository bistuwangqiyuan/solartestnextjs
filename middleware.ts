import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 需要认证的路径
const protectedRoutes = ['/dashboard', '/data', '/experiment', '/monitor', '/analysis', '/settings'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 检查是否是受保护的路由
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // 从cookie中获取认证信息
  const hasAuth = request.cookies.has('auth-storage');
  
  if (isProtectedRoute && !hasAuth) {
    // 如果是受保护的路由但没有认证，重定向到登录页
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (pathname === '/login' && hasAuth) {
    // 如果已经登录但访问登录页，重定向到仪表板
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};