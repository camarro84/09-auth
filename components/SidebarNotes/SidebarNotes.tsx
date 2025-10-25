'use client'
import React from 'react'
import css from './SidebarNotes.module.css'
import { TAGS } from '@/constants/tags'
import Link from 'next/link'

const SidebarNotes = () => {
  return (
    <nav>
      <ul className={css.menuList}>
        {TAGS.map((tag) => (
          <li className={css.menuItem} key={tag}>
            <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default SidebarNotes
