'use client'

import Link from 'next/link'
import css from './SidebarNotes.module.css'

const TAGS = [
  { label: 'All notes', href: '/notes/filter/all' },
  { label: 'Work', href: '/notes/filter/Work' },
  { label: 'Personal', href: '/notes/filter/Personal' },
  { label: 'Meeting', href: '/notes/filter/Meeting' },
  { label: 'Shopping', href: '/notes/filter/Shopping' },
  { label: 'Todo', href: '/notes/filter/Todo' },
]

export default function SidebarNotes() {
  return (
    <nav>
      <ul className={css.menuList}>
        {TAGS.map((item) => (
          <li className={css.menuItem} key={item.label}>
            <Link href={item.href} className={css.menuLink}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
