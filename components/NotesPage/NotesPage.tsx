'use client'

import React, { ReactNode } from 'react'
import Link from 'next/link'

import css from './NotesPage.module.css'
import SearchBox from '../SearchBox/SearchBox'
import Pagination from '../Pagination/Pagination'
import LayoutNotes from '../LayoutNotes/LayoutNotes'
import SidebarNotes from '../SidebarNotes/SidebarNotes'
import { NoteListResponse } from '@/types/note'

type Props = {
  data: NoteListResponse
  children: ReactNode
  setPage: (page: number) => void
  setSearch: (search: string) => void
  currentPage: number
  isFetching?: boolean
}

const NotesPage = ({
  data,
  children,
  setPage,
  setSearch,
  currentPage,
  isFetching,
}: Props) => {
  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox onSearch={setSearch} />
        <Pagination
          totalPages={data.totalPages}
          currentPage={currentPage}
          onPageChange={setPage}
        />
        {isFetching && <span className={css.loading}>Loading...</span>}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>

      <LayoutNotes sidebar={<SidebarNotes />}>{children}</LayoutNotes>
    </div>
  )
}

export default NotesPage
