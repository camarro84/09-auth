import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privateRoutes = ['/profile', '/notes']
const authRoutes = ['/sign-in', '/sign-up']

const API_BASE = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : ''

async function checkSession(cookieHeader: string) {
  if (!API_BASE) return null
  const res = await fetch(`${API_BASE}/auth/session`, {
    method: 'GET',
    headers: { cookie: cookieHeader },
    credentials: 'include',
    cache: 'no-store',
  })
  let data: unknown = null
  try {
    data = await res.json()
  } catch {}
  return { res, data }
}

function splitSetCookie(v: string | null) {
  if (!v) return []
  return v.split(/,(?=[^;]+?=)/g)
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isPrivate = privateRoutes.some((r) => pathname.startsWith(r))
  const isAuth = authRoutes.some((r) => pathname.startsWith(r))

  const accessToken = req.cookies.get('accessToken')?.value
  const refreshToken = req.cookies.get('refreshToken')?.value

  let authenticated = false
  let sessionResult: Awaited<ReturnType<typeof checkSession>> | null = null

  if ((accessToken || refreshToken) && API_BASE) {
    sessionResult = await checkSession(req.headers.get('cookie') ?? '')
    authenticated = !!sessionResult && sessionResult.res.status === 200 && !!sessionResult.data
  }

  if (isPrivate && !authenticated) {
    const url = req.nextUrl.clone()
    url.pathname = '/sign-in'
    return NextResponse.redirect(url)
  }

  if (isAuth && authenticated) {
    const url = req.nextUrl.clone()
    url.pathname = '/'
    const res = NextResponse.redirect(url)
    if (sessionResult) {
      for (const c of splitSetCookie(sessionResult.res.headers.get('set-cookie'))) {
        res.headers.append('Set-Cookie', c)
      }
    }
    return res
  }

  const res = NextResponse.next()
  if (sessionResult) {
    for (const c of splitSetCookie(sessionResult.res.headers.get('set-cookie'))) {
      res.headers.append('Set-Cookie', c)
    }
  }
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
