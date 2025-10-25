import Image from 'next/image'
import Link from 'next/link'
import css from './ProfilePage.module.css'
import { checkSessionServer, getMeServer } from '@/lib/api/serverApi'

export const metadata = {
  title: 'Profile Page',
  description: 'User profile',
}

export default async function ProfilePage() {
  const rawUser = (await checkSessionServer()) || (await getMeServer()) || null

  const user = rawUser && {
    username: rawUser.username || 'your_username',
    email: rawUser.email || 'your_email@example.com',
    avatar:
      rawUser.avatar ||
      'https://ac.goit.global/fullstack/react/avatar-default.jpg',
  }

  if (!user) {
    return (
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <h1 className={css.formTitle}>You are not logged in</h1>
          <Link href="/sign-in" className={css.editProfileButton}>
            Go to Sign in
          </Link>
        </div>
      </main>
    )
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
            src={user.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  )
}
