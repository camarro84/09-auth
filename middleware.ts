import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value
  const isAuthPage = req.nextUrl.pathname.startsWith('/sign-in')
  const isProtectedPage = req.nextUrl.pathname.startsWith('/profile')

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
