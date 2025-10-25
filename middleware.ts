import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value
  const path = req.nextUrl.pathname

  const isAuthPage = path.startsWith('/sign-in') || path.startsWith('/sign-up')

  const isProtectedPage =
    path.startsWith('/profile') || path.startsWith('/notes')

  if (!accessToken && isProtectedPage) {
    const loginUrl = new URL('/sign-in', req.url)
    return NextResponse.redirect(loginUrl)
  }

  if (accessToken && isAuthPage) {
    const profileUrl = new URL('/profile', req.url)
    return NextResponse.redirect(profileUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
}
