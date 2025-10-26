'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useUserStore } from '@/lib/store/authStore'
import { updateMe } from '@/lib/api/clientApi'
import css from '../ProfilePage.module.css'

export default function EditProfilePage() {
  const router = useRouter()
  const user = useUserStore((s) => s.user)
  const setUser = useUserStore((s) => s.setUser)

  const [username, setUsername] = useState(user?.username ?? '')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const updated = await updateMe({ username })
    setUser(updated)
    router.push('/profile')
  }

  function handleCancel() {
    router.push('/profile')
  }

  const email = user?.email ?? 'user_email@example.com'
  const avatar = user?.avatar ?? ''

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={avatar || '/default-avatar.png'}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
