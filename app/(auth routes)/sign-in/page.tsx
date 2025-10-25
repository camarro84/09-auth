'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import css from './SignInPage.module.css'
import { login } from '@/lib/api/clientApi'
import { useUserStore } from '@/lib/store/authStore'

export default function SignInPage() {
  const router = useRouter()
  const setUser = useUserStore((s) => s.setUser)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setError('')
      setLoading(true)

      const formData = new FormData(e.currentTarget)
      const email = String(formData.get('email') || '').trim()
      const password = String(formData.get('password') || '').trim()

      try {
        const user = await login({ email, password })
        setUser(user)
        router.push('/profile')
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
      <form className={css.form} onSubmit={onSubmit}>
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
