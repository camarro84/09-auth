import { NextResponse } from 'next/server'
import { api } from '../../api'
import { isAxiosError } from 'axios'
import { logErrorResponse } from '../../_utils/utils'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const apiRes = await api.post('/auth/login', body, {
      withCredentials: true,
    })

    const setCookies = apiRes.headers['set-cookie']
    if (!setCookies) {
      return NextResponse.json({ error: 'Tokens not found' }, { status: 401 })
    }

    // ✅ Створюємо NextResponse
    const response = NextResponse.redirect(new URL('/profile', req.url))
    const isProd = process.env.NODE_ENV === 'production'

    for (const cookieString of Array.isArray(setCookies)
      ? setCookies
      : [setCookies]) {
      const [nameValue] = cookieString.split(';')
      const [name, value] = nameValue.split('=')

      response.cookies.set({
        name,
        value,
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        path: '/',
        maxAge: name === 'accessToken' ? 900 : 7 * 24 * 60 * 60,
      })
    }

    return response
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data)
      return NextResponse.json(
        { error: error.message, response: error.response?.data || null },
        { status: error.response?.status || 500 },
      )
    }

    logErrorResponse({ message: (error as Error).message })
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
