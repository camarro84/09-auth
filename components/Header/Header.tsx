'use client'

import Link from 'next/link'
import css from './Header.module.css'
import AuthNavigation from '@/components/AuthNavigation/AuthNavigation'
import { useUserStore } from '@/lib/store/authStore'

export default function Header() {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated)

  return (
    <header className={css.header}>
      <div className={css.headerInner}>
        <Link
          href="/"
          aria-label="Home"
          className={css.headerLink}
          prefetch={false}
        >
          NoteHub
        </Link>

        <nav aria-label="Main Navigation">
          <ul className={css.navigation}>
            <li className={css.navigationItem}>
              <Link href="/" className={css.navigationLink} prefetch={false}>
                Home
              </Link>
            </li>

            {isAuthenticated && (
              <li className={css.navigationItem}>
                <Link
                  href="/notes"
                  className={css.navigationLink}
                  prefetch={false}
                >
                  Notes
                </Link>
              </li>
            )}

            <AuthNavigation />
          </ul>
        </nav>
      </div>
    </header>
  )
}
