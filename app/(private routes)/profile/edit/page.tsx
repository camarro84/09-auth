'use client'

import { useEffect, useState, FormEvent } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import css from './EditProfilePage.module.css'
import { getMe, updateMe } from '@/lib/api/clientApi'
import { useUserStore } from '@/lib/store/authStore'
import { User } from '@/types/user'

export default function ProfileEditPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [user, setUser] = useState<User | null>(null)
  const [username, setUsername] = useState<string>('')

  useEffect(() => {
    let isMounted = true

    async function loadUser() {
      try {
        const me = await getMe()
        if (!isMounted) return

        const normalizedUser: User = {
          email: me.email,
          username: me.username,
          avatar:
            me.avatar ||
            'https://ac.goit.global/fullstack/react/default-avatar.jpg',
        }

        setUser(normalizedUser)
        setUsername(normalizedUser.username || '')
      } catch {
        if (!isMounted) return

        const fallbackUser: User = {
          email: 'your_email@example.com',
          username: 'your_username',
          avatar: 'https://ac.goit.global/fullstack/react/default-avatar.jpg',
        }

        setUser(fallbackUser)
        setUsername(fallbackUser.username)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadUser()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setError('')

    try {
      const updatedUser = await updateMe({ username })

      useUserStore.getState().setUser(updatedUser)

      const targetUsername = updatedUser.username || ''
      const targetEmail = updatedUser.email || ''

      router.push(
        `/profile?username=${encodeURIComponent(
          targetUsername,
        )}&email=${encodeURIComponent(targetEmail)}`,
      )
      router.refresh()
    } catch {
      setError('Failed to save')
      setSaving(false)
    }
  }

  function handleCancel() {
    router.push('/profile')
  }

  if (loading) {
    return (
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <h1 className={css.formTitle}>Edit Profile</h1>
          <p>Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={
            user?.avatar ||
            'https://ac.goit.global/fullstack/react/default-avatar.jpg'
          }
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
              disabled={saving}
              required
            />
          </div>

          <p>Email: {user?.email ?? 'your_email@example.com'}</p>

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={saving || !username.trim()}
            >
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
          </div>

          {error && <p className={css.error}>{error}</p>}
        </form>
      </div>
    </main>
  )
}
