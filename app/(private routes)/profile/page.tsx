import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getMeServer } from '@/lib/api/serverApi'
import css from './ProfilePage.module.css'

export const metadata: Metadata = {
  title: 'Profile Page',
  description: 'User profile page',
}

export default async function ProfilePage() {
  const user = await getMeServer()

  const username = user?.username ?? 'your_username'
  const email = user?.email ?? 'your_email@example.com'
  const avatar = user?.avatar ?? ''

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
            src={avatar || '/default-avatar.png'}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {username}</p>
          <p>Email: {email}</p>
        </div>
      </div>
    </main>
  )
}
