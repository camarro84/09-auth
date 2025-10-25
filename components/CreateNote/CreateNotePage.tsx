'use client'

import React from 'react'
import css from '@/components/CreateNote/CreateNote.module.css'
import NoteForm from '../NoteForm/NoteForm'

const CreateNotePage = () => {
  console.log('🚀 ~ css:', css)
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  )
}

export default CreateNotePage
