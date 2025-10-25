'use client'

import { useEffect, useState, useCallback } from 'react'
import css from './EditProfilePage.module.css'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getMe, updateMe } from '@/lib/api/clientApi'
import { useUserStore } from '@/lib/store/authStore'

export default function ProfileEditPage() {
  const router = useRouter()
  const userFromStore = useUserStore((s) => s.user)
  const setUser = useUserStore((s) => s.setUser)

  const [username, setUsername] = useState(userFromStore?.username || '')
  const [email, setEmail] = useState(userFromStore?.email || '')
  const [avatar, setAvatar] = useState(
    userFromStore?.avatar ||
      'https://ac.goit.global/fullstack/react/avatar-default.jpg',
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      try {
        if (!userFromStore) {
          const me = await getMe()
          if (active && me) {
            setUser(me)
            setUsername(me.username)
            setEmail(me.email)
            setAvatar(
              me.avatar ||
                'https://ac.goit.global/fullstack/react/avatar-default.jpg',
            )
          }
        } else {
          setUsername(userFromStore.username)
          setEmail(userFromStore.email)
          setAvatar(
            userFromStore.avatar ||
              'https://ac.goit.global/fullstack/react/avatar-default.jpg',
          )
        }
      } catch {
        router.push('/sign-in')
      }
    }
    load()
    return () => {
      active = false
    }
  }, [router, setUser, userFromStore])

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setSaving(true)
      setError('')

      try {
        const updated = await updateMe({ username })
        setUser(updated)
        router.push('/profile')
      } catch {
        setError('Update failed')
      } finally {
        setSaving(false)
      }
    },
    [router, setUser, username],
  )

  const onCancel = useCallback(() => {
    router.push('/profile')
  }, [router])

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={onSubmit}>
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
            <button type="submit" className={css.saveButton} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
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
