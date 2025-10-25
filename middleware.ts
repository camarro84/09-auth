import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const accessToken = req.cookies.get('accessToken')?.value

  const isAuthPage =
    pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')

  const isPrivatePage =
    pathname.startsWith('/profile') || pathname.startsWith('/notes')

  if (!accessToken && isPrivatePage) {
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
  matcher: [
    '/sign-in',
    '/sign-up',
    '/profile',
    '/profile/:path*',
    '/notes/:path*',
  ],
}
