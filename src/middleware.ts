import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple auth password (stored in environment variable for security)
const AUTH_PASSWORD = process.env.AUTH_PASSWORD || process.env.NEXT_PUBLIC_AUTH_PASSWORD || '0112423995'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Check if user is authenticated
  const authPassword = req.cookies.get('auth_password')?.value

  // Allow access to login page
  if (req.nextUrl.pathname === '/login') {
    if (authPassword === AUTH_PASSWORD) {
      return NextResponse.redirect(new URL('/', req.url))
    }
    return res
  }

  // For all other routes, check authentication
  if (!authPassword || authPassword !== AUTH_PASSWORD) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
