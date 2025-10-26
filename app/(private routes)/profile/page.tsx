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

  const fallbackEmail = 'your_email@example.com'
  const fallbackUsername = 'your_username'
  const fallbackAvatar =
    'https://ac.goit.global/fullstack/react/default-avatar.jpg'

  const safeEmail =
    typeof serverUser?.email === 'string' && serverUser.email.trim() !== ''
      ? serverUser.email
      : fallbackEmail

  const safeUsername =
    typeof serverUser?.username === 'string' &&
    serverUser.username.trim() !== ''
      ? serverUser.username
      : fallbackUsername

  const safeAvatar =
    typeof serverUser?.avatar === 'string' &&
    serverUser.avatar.trim() !== ''
      ? serverUser.avatar
      : fallbackAvatar

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
