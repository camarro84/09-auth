'use client'

import Link from 'next/link'
import css from './AuthNavigation.module.css'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/lib/store/authStore'
import { logout } from '@/lib/api/clientApi'

export default function AuthNavigation() {
  const router = useRouter()
  const user = useUserStore((s) => s.user)
  const isAuthenticated = useUserStore((s) => s.isAuthenticated)
  const clearUser = useUserStore((s) => s.clearUser)

  async function handleLogout() {
    try {
      await logout()
    } finally {
      clearUser()
      router.push('/sign-in')
    }
  }

  if (!isAuthenticated || !user) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
            Sign in
          </Link>
        </li>

        <li className={css.navigationItem}>
          <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
            Sign up
          </Link>
        </li>
      </>
    )
  }

  return (
    <>
      <li className={css.navigationItem}>
        <Link href="/profile" prefetch={false} className={css.navigationLink}>
          Profile
        </Link>
      </li>

      <li className={css.navigationItem}>
        <p className={css.userEmail}>{user.email}</p>
        <button className={css.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </li>
    </>
  )
}
