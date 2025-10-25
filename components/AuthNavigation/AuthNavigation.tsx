'use client'

import Link from 'next/link'
import css from './AuthNavigation.module.css'
import { useUserStore } from '@/lib/store/authStore'
import { logout } from '@/lib/api/clientApi'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const AuthNavigation = () => {
  const router = useRouter()
  const { user, isAuthenticated, clearUser, hydrated, setHydrated } =
    useUserStore()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearUser()
      router.push('/')
    }
  }

  // ✅ Встановлюємо hydrated після першого рендеру
  useEffect(() => {
    setHydrated(true)
  }, [setHydrated])

  if (!hydrated) return <p className={css.loading}>Loading...</p>

  return (
    <>
      {isAuthenticated && user ? (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/profile"
              prefetch={false}
              className={css.navigationLink}
            >
              Profile
            </Link>
          </li>
          <li className={css.navigationItem}>
            <p className={css.userEmail}>{user.email}</p>
            <button
              onClick={handleLogout}
              className={css.logoutButton}
              type="button"
            >
              Logout
            </button>
          </li>
        </>
      ) : (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/sign-in"
              prefetch={false}
              className={css.navigationLink}
            >
              Login
            </Link>
          </li>
          <li className={css.navigationItem}>
            <Link
              href="/sign-up"
              prefetch={false}
              className={css.navigationLink}
            >
              Sign up
            </Link>
          </li>
        </>
      )}
    </>
  )
}

export default AuthNavigation
