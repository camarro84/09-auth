'use client'

import css from './SignInPage.module.css'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { login, getMe } from '@/lib/api/clientApi'
import { useUserStore } from '@/lib/store/authStore'

export default function SignInPage() {
  const router = useRouter()
  const { user, setUser, hydrated } = useUserStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user && hydrated) {
      router.push('/profile')
    }
  }, [user, hydrated, router])

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError('')

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      setError("Email і пароль обов'язкові")
      setLoading(false)
      return
    }

    try {
      await login({ email, password })
      const currentUser = await getMe()

      if (currentUser) setUser(currentUser)
      else setError('Не вдалося отримати користувача')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Сталася помилка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={css.mainContent}>
      <form
        className={css.form}
        onSubmit={async (e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          await handleSubmit(formData)
        }}
      >
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
