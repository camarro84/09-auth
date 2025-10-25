import Image from 'next/image'
import css from './ProfilePage.module.css'
import { checkSessionServer, getMeServer } from '@/lib/api/serverApi'

export const metadata = {
  title: 'Profile Page',
  description: 'User profile',
}

export default async function ProfilePage() {
  const me = (await checkSessionServer()) || (await getMeServer())

  if (!me) {
    return (
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <div className={css.header}>
            <h1 className={css.formTitle}>Profile Page</h1>
          </div>

          <div className={css.avatarWrapper}>
            <Image
              src="/default-avatar.png"
              alt="User Avatar"
              width={120}
              height={120}
              className={css.avatar}
            />
          </div>

          <div className={css.profileInfo}>
            <p>Username: —</p>
            <p>Email: —</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>

          <a href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </a>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={me.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {me.username}</p>
          <p>Email: {me.email}</p>
        </div>
      </div>
    </main>
  )
}
