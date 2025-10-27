'use client'

import css from './Pagination.module.css'

type Props = {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: Props) {
  const goTo = (page: number) => {
    if (page < 1 || page > totalPages) return
    onPageChange(page)
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <ul className={css.pagination}>
      <li onClick={() => goTo(currentPage - 1)}>
        <a>{'‹'}</a>
      </li>

      {pages.map((p) => (
        <li
          key={p}
          className={p === currentPage ? css.active : undefined}
          onClick={() => goTo(p)}
        >
          <a>{p}</a>
        </li>
      ))}

      <li onClick={() => goTo(currentPage + 1)}>
        <a>{'›'}</a>
      </li>
    </ul>
  )
}
