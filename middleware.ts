import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkSessionServer } from './lib/api/serverApi'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const accessToken = req.cookies.get('accessToken')?.value || ''
  const refreshToken = req.cookies.get('refreshToken')?.value || ''

  const isAuthPage =
    pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')

  const isPrivatePage =
    pathname.startsWith('/profile') || pathname.startsWith('/notes')

  if (!accessToken && refreshToken) {
    const sessionRes = await checkSessionServer()

    if (sessionRes.ok) {
      const setCookie = sessionRes.headers.get('set-cookie')

      if (setCookie) {
        const res = NextResponse.next()
        const cookiesArray: string[] = Array.isArray(setCookie)
          ? (setCookie as string[])
          : [setCookie]

        for (const cookieStr of cookiesArray) {
          const parts: string[] = cookieStr
            .split(';')
            .map((segment: string) => segment.trim())
          const [nameValue, ...rest] = parts
          const [name, value] = nameValue.split('=')

          const opts: {
            path?: string
            maxAge?: number
            expires?: Date
            httpOnly?: boolean
            secure?: boolean
            sameSite?: 'lax' | 'strict' | 'none'
          } = {}

          for (const attr of rest) {
            const lower = attr.toLowerCase()

            if (lower.startsWith('path=')) {
              opts.path = attr.substring(5)
            } else if (lower.startsWith('max-age=')) {
              const n = Number(attr.substring(8))
              if (!Number.isNaN(n)) opts.maxAge = n
            } else if (lower.startsWith('expires=')) {
              const dateStr = attr.substring(8)
              const d = new Date(dateStr)
              if (!Number.isNaN(d.getTime())) opts.expires = d
            } else if (lower === 'httponly') {
              opts.httpOnly = true
            } else if (lower === 'secure') {
              opts.secure = true
            } else if (lower.startsWith('samesite=')) {
              const v = attr.substring(9).toLowerCase()
              if (v === 'lax' || v === 'strict' || v === 'none') {
                opts.sameSite = v
              }
            }
          }

          res.cookies.set(name, value, opts)
        }

        if (isAuthPage) {
          const profileUrl = new URL('/profile', req.url)
          return NextResponse.redirect(profileUrl)
        }

        return res
      }
    }
  }

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
