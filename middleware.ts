import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function isValidToken(value: string | undefined) {
  if (!value) return false
  const v = value.trim().toLowerCase()
  if (v === '' || v === 'null' || v === 'undefined') return false
  return true
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const accessToken = req.cookies.get('accessToken')?.value
  const refreshToken = req.cookies.get('refreshToken')?.value

  const hasSession = isValidToken(accessToken) || isValidToken(refreshToken)

  const isAuthPage =
    pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')

  const isPrivatePage =
    pathname.startsWith('/profile') || pathname.startsWith('/notes')

  if (isPrivatePage && !hasSession) {
    const url = new URL('/sign-in', req.url)
    return NextResponse.redirect(url)
  }

  if (isAuthPage && hasSession) {
    const url = new URL('/profile', req.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
}
