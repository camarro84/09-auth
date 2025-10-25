import React from 'react'
import css from './ProfilePage.module.css'
import ProfileClient from './ProfileClient'

export default function Page() {
  return (
    <main className={css.mainContent}>
      <ProfileClient />
    </main>
  )
}
