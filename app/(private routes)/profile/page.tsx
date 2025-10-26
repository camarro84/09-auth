import Image from 'next/image'
import Link from 'next/link'
import css from './ProfilePage.module.css'
import { checkSessionServer, getMeServer } from '@/lib/api/serverApi'

export const metadata = {
  title: 'Profile Page',
  description: 'User profile page with account info',
}

export default async function ProfilePage() {
  const serverUser =
    (await checkSessionServer()) || (await getMeServer()) || null

  const fallbackUser = {
    email: 'your_email@example.com',
    username: 'your_username',
    avatar: 'https://ac.goit.global/fullstack/react/avatar-default.jpg',
  }

  const finalUser = {
    email:
      serverUser?.email && serverUser.email.trim() !== ''
        ? serverUser.email
        : fallbackUser.email,
    username:
      serverUser?.username && serverUser.username.trim() !== ''
        ? serverUser.username
        : fallbackUser.username,
    avatar:
      serverUser?.avatar && serverUser.avatar.trim() !== ''
        ? serverUser.avatar
        : fallbackUser.avatar,
  }

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
            src={finalUser.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {finalUser.username}</p>
          <p>Email: {finalUser.email}</p>
        </div>
      </div>
    </main>
  )
}
