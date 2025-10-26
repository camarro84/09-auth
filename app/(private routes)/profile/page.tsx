import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import css from './ProfilePage.module.css'
import { checkSessionServer, getMeServer } from '@/lib/api/serverApi'

export const metadata: Metadata = {
  title: 'Profile Page',
  description: 'User profile page with account info',
}

type Props = {
  searchParams?: {
    username?: string
    email?: string
  }
}

export default async function ProfilePage({ searchParams }: Props) {
  const sessionRes = await checkSessionServer()
  let sessionUser: {
    email?: string
    username?: string
    avatar?: string
  } | null = null

  if (sessionRes.ok) {
    try {
      sessionUser = await sessionRes.json()
    } catch {
      sessionUser = null
    }
  }

  const meUser = await getMeServer()

  const serverUser = sessionUser || meUser || null

  const fallbackEmail = 'your_email@example.com'
  const fallbackUsername = 'your_username'
  const fallbackAvatar =
    'https://ac.goit.global/fullstack/react/default-avatar.jpg'

  const qpUsername =
    typeof searchParams?.username === 'string' &&
    searchParams.username.trim() !== ''
      ? searchParams.username
      : null

  const qpEmail =
    typeof searchParams?.email === 'string' && searchParams.email.trim() !== ''
      ? searchParams.email
      : null

  const apiUsername =
    typeof serverUser?.username === 'string' &&
    serverUser.username.trim() !== ''
      ? serverUser.username
      : null

  const apiEmail =
    typeof serverUser?.email === 'string' && serverUser.email.trim() !== ''
      ? serverUser.email
      : null

  const apiAvatar =
    typeof serverUser?.avatar === 'string' && serverUser.avatar.trim() !== ''
      ? serverUser.avatar
      : null

  const safeUsername = qpUsername || apiUsername || fallbackUsername
  const safeEmail = qpEmail || apiEmail || fallbackEmail
  const safeAvatar = apiAvatar || fallbackAvatar

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={safeAvatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {safeUsername}</p>
          <p>Email: {safeEmail}</p>
        </div>
      </div>
    </main>
  )
}
