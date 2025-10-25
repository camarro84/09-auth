import React, { useState } from 'react'
import css from './Pagination.module.css'
import clsx from 'clsx'
import Button from '../Button/Button'

type Props = {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
}

const Pagination = ({ totalPages, onPageChange }: Props) => {
  const [activePage, setActivePage] = useState(1)

  const handleClick = (page: number) => {
    setActivePage(page)
    onPageChange(page)
  }
  const handleArrowClick = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && activePage > 1) {
      const newPage = activePage - 1
      setActivePage(newPage)
      onPageChange(newPage)
    }
    if (direction === 'next' && activePage < totalPages) {
      const newPage = activePage + 1
      setActivePage(newPage)
      onPageChange(newPage)
    }
  }

  return (
    <div className={css.paginationBlock}>
      <ul className={css.pagination}>
        <li
          className={clsx(
            activePage === 1 ? css.btnArrowUnActive : css.btnArrow,
          )}
        >
          <Button
            name="btnPrew"
            typeBtn="button"
            className={clsx(
              activePage === 1
                ? clsx(css.arrowUnactive, css.arrow)
                : clsx(css.arrow, css.arrowPrev),
            )}
            value="<-"
            onClick={() => handleArrowClick('prev')}
          />
        </li>
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1
          return (
            <li
              key={page}
              onClick={() => handleClick(page)}
              className={page === activePage ? css.active : ''}
            >
              <a>{page}</a>
            </li>
          )
        })}
        <li
          className={clsx(
            activePage === totalPages ? css.btnArrowUnActive : css.btnArrow,
          )}
        >
          <Button
            name="btnNext"
            typeBtn="button"
            className={clsx(
              activePage === totalPages
                ? clsx(css.arrowUnactive, css.arrow)
                : clsx(css.arrow, css.arrowNext),
            )}
            value="->"
            onClick={() => handleArrowClick('next')}
          />
        </li>
      </ul>
    </div>
  )
}

export default Pagination
