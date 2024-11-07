import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('currentUser')?.value
  const { pathname } = request.nextUrl

  const allowedRoutes = ['/forget-password', '/send-reset-token', '/forget-password/update-password']
  const isAllowedRoute = allowedRoutes.some(route => pathname.startsWith(route))

  if (!currentUser && !pathname.startsWith('/login') && !isAllowedRoute) {
    return Response.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
