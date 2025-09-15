import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 需要认证的路径
const protectedRoutes = ['/dashboard', '/data', '/experiment', '/monitor', '/analysis', '/settings'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 去掉权限管理，所有人都可以访问所有页面
  console.log('Public access mode - all routes accessible');
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