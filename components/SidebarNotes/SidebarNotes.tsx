'use client'

import Link from 'next/link'
import css from './SidebarNotes.module.css'

export default function SidebarNotes() {
  return (
    <nav>
      <ul className={css.menuList}>
        <li className={css.menuItem}><Link className={css.menuLink} href="/notes/filter/all">All notes</Link></li>
        <li className={css.menuItem}><Link className={css.menuLink} href="/notes/filter/work">Work</Link></li>
        <li className={css.menuItem}><Link className={css.menuLink} href="/notes/filter/personal">Personal</Link></li>
        <li className={css.menuItem}><Link className={css.menuLink} href="/notes/filter/meeting">Meeting</Link></li>
        <li className={css.menuItem}><Link className={css.menuLink} href="/notes/filter/shopping">Shopping</Link></li>
        <li className={css.menuItem}><Link className={css.menuLink} href="/notes/filter/todo">Todo</Link></li>
      </ul>
    </nav>
  )
}
