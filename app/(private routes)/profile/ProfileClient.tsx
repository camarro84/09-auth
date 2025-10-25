'use client'

import React from 'react'
import css from './ProfilePage.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { useUserStore } from '@/lib/store/authStore'

export default function ProfileClient() {
  const { user, isAuthenticated } = useUserStore()

  if (!isAuthenticated) {
    return (
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>You are not logged in</h1>
        <Link href="/sign-in" className={css.editProfileButton}>
          Go to login
        </Link>
      </div>
    )
  }

  if (!user) {
    return <p>Loading profile...</p>
  }

  return (
    <div className={css.profileCard}>
      <div className={css.header}>
        <h1 className={css.formTitle}>Profile Page</h1>
        <Link href="/profile/edit" className={css.editProfileButton}>
          Edit Profile
        </Link>
      </div>

      <div className={css.avatarWrapper}>
        <Image
          src={
            user.avatar ||
            'https://ac.goit.global/fullstack/react/default-avatar.jpg'
          }
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
  )
}
