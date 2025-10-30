import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies as nextCookies } from 'next/headers'

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

function joinCookieHeader(list: Array<{ name: string; value: string }>) {
  return list.map((c) => `${c.name}=${c.value}`).join('; ')
}

function splitSetCookie(v: string | null): string[] {
  if (!v) return []
  return v.split(/,(?=[^;]+?=)/g)
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const cookieStore = await nextCookies()
  const all = cookieStore.getAll()
  const cookieHeader = joinCookieHeader(all)
  const hasAccess = !!cookieStore.get('accessToken')
  const hasRefresh = !!cookieStore.get('refreshToken')

  const isPrivate = pathname.startsWith('/profile') || pathname.startsWith('/notes')
  const isAuth = pathname === '/sign-in' || pathname === '/sign-up'

  let authenticated = false
  let sessionResult: Awaited<ReturnType<typeof checkSession>> | null = null

  const shouldCheck = hasAccess || (!hasAccess && hasRefresh)
  if (API_BASE && shouldCheck) {
    sessionResult = await checkSession(cookieHeader)
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
      const headers = sessionResult.res.headers.get('set-cookie')
      for (const c of splitSetCookie(headers)) {
        res.headers.append('Set-Cookie', c)
      }
    }
    return res
  }

  const res = NextResponse.next()
  if (sessionResult) {
    const headers = sessionResult.res.headers.get('set-cookie')
    for (const c of splitSetCookie(headers)) {
      res.headers.append('Set-Cookie', c)
    }
  }
  return res
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
}
