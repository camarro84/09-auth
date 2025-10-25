'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import css from './SignInPage.module.css'
import { login, getMe, checkSession } from '@/lib/api/clientApi'
import { useUserStore } from '@/lib/store/authStore'

export default function SignInPage() {
  const router = useRouter()

  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      router.replace('/profile')
    }
  }, [user, router])

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      setLoading(true)
      setError('')

      try {
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        await login({ email, password })

        let currentUser = await checkSession()
        if (!currentUser) {
          currentUser = await getMe()
        }

        if (!currentUser) {
          setError('Failed to load user data')
          setLoading(false)
          return
        }

        setUser(currentUser)
        router.replace('/profile')
      } catch {
        setError('Login failed')
      } finally {
        setLoading(false)
      }
    },
    [router, setUser],
  )

  return (
    <main className={css.mainContent}>
      <form className={css.form} action={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton} disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  )
}
