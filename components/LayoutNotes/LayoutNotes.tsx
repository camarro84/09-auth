'use client'

import React, { ReactNode } from 'react'
import css from './LayoutNotes.module.css'

type Props = {
  sidebar: ReactNode
  children: ReactNode
}

export default function LayoutNotes({ sidebar, children }: Props) {
  return (
    <div className={css.container}>
      <div className={css.sidebar}>{sidebar}</div>
      <div className={css.notesWrapper}>{children}</div>
    </div>
  )
}
