import React from 'react'
import css from './LayoutNotes.module.css'

type Props = {
  children: React.ReactNode
  sidebar: React.ReactNode
}

export default function LayoutNotes({ children, sidebar }: Props) {
  return (
    <div className={css.container} style={{ height: 'auto', minHeight: 'auto' }}>
      <div className={css.sidebar} style={{ height: 'auto', minHeight: 'auto' }}>
        {sidebar}
      </div>
      <div className={css.notesWrapper} style={{ flex: 1, minHeight: 'auto' }}>
        {children}
      </div>
    </div>
  )
}
