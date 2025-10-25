'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import css from './SignUpPage.module.css'
import { register } from '@/lib/api/clientApi'
import { useUserStore } from '@/lib/store/authStore'

export default function SignUpPage() {
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
      const username = email.split('@')[0] || 'user'

      try {
        const user = await register({ email, password, username })
        setUser(user)
        router.push('/profile')
      } catch {
        setError('Registration failed')
      } finally {
        setLoading(false)
      }
    },
    [router, setUser],
  )

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>

      <form className={css.form} onSubmit={onSubmit}>
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
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  )
}
