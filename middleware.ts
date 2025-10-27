import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkSessionServer } from '@/lib/api/serverApi'

const privateRoutes = ['/profile', '/notes']
const authRoutes = ['/sign-in', '/sign-up']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isPrivate = privateRoutes.some((route) => pathname.startsWith(route))
  const isAuth = authRoutes.some((route) => pathname.startsWith(route))

  const accessToken = req.cookies.get('accessToken')?.value
  const refreshToken = req.cookies.get('refreshToken')?.value

  let user = null

  if (accessToken) {
    user = await checkSessionServer()
  } else if (refreshToken) {
    user = await checkSessionServer()
  }

  if (isPrivate && !user) {
    const url = req.nextUrl.clone()
    url.pathname = '/sign-in'
    return NextResponse.redirect(url)
  }

  if (isAuth && user) {
    const url = req.nextUrl.clone()
    url.pathname = '/profile'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
}
