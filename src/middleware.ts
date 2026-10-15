import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple auth password (stored in environment variable for security)
const AUTH_PASSWORD = process.env.NEXT_PUBLIC_AUTH_PASSWORD || '0112423995'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Check if user is authenticated
  const authPassword = req.cookies.get('auth_password')?.value

  // If no session and trying to access protected routes, redirect to login
  if (!authPassword || authPassword !== AUTH_PASSWORD) {
    if (req.nextUrl.pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  // If session exists and trying to access login, redirect to home
  if (authPassword === AUTH_PASSWORD && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
