// Next.js 16 calls this file "proxy". (On Next.js 15 or older: rename this file to
// middleware.ts and rename the function below to `middleware`.)
import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, verifyToken } from '@/lib/jwt'

// Runs before every page request: no valid login cookie -> go to /login.
// The login and sign-up pages stay open to everyone.
export async function proxy(request: NextRequest) {
  const userId = await verifyToken(request.cookies.get(SESSION_COOKIE)?.value)
  const path = request.nextUrl.pathname
  const isPublic = path.startsWith('/login') || path.startsWith('/signup')

  if (!userId && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
