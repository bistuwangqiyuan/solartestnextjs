import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /login, /dashboard)
  const path = request.nextUrl.pathname

  // Define paths that don't require authentication
  const publicPaths = ['/login']
  
  // Check if the current path is public
  const isPublicPath = publicPaths.includes(path)

  // Get the token from the cookies
  const token = request.cookies.get('auth-storage')?.value || ''

  // Redirect logic
  if (!isPublicPath && !token) {
    // If trying to access a protected route without a token, redirect to login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isPublicPath && token && path === '/login') {
    // If trying to access login page with a token, redirect to home
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}