import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies as nextCookies } from 'next/headers'

const privateRoutes = ['/profile', '/notes']
const authRoutes = ['/sign-in', '/sign-up']

const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : ''

async function checkSessionWithCookies(cookieHeader: string) {
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
  const isPrivate = privateRoutes.some((r) => pathname.startsWith(r))
  const isAuth = authRoutes.some((r) => pathname.startsWith(r))

  const cookieStore = await nextCookies()
  const all = cookieStore.getAll()
  const cookieHeader = joinCookieHeader(all)

  let authenticated = false
  let sessionResult: Awaited<ReturnType<typeof checkSessionWithCookies>> | null =
    null

  const hasTokens =
    all.some((c) => c.name === 'accessToken') ||
    all.some((c) => c.name === 'refreshToken')

  if (API_BASE && hasTokens) {
    sessionResult = await checkSessionWithCookies(cookieHeader)
    authenticated =
      !!sessionResult && sessionResult.res.status === 200 && !!sessionResult.data
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
      for (const header of splitSetCookie(
        sessionResult.res.headers.get('set-cookie')
      )) {
        res.headers.append('Set-Cookie', header)
      }
    }
    return res
  }

  const res = NextResponse.next()
  if (sessionResult) {
    for (const header of splitSetCookie(
      sessionResult.res.headers.get('set-cookie')
    )) {
      res.headers.append('Set-Cookie', header)
    }
  }
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
