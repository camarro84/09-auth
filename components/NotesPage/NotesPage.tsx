'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'

import css from './NotesPage.module.css'

import SearchBox from '@/components/SearchBox/SearchBox'
import Pagination from '@/components/Pagination/Pagination'
import LayoutNotes from '@/components/LayoutNotes/LayoutNotes'
import SidebarNotes from '@/components/SidebarNotes/SidebarNotes'
import NoteList from '@/components/NoteList/NoteList'

import { NoteListResponse } from '@/types/note'
import { fetchNotes } from '@/lib/api/clientApi'

type Props = {
  initialData: NoteListResponse
}

export default function NotesPage({ initialData }: Props) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const { data, isFetching } = useQuery({
    queryKey: ['notes', { page, search }],
    queryFn: async () => {
      const res = await fetchNotes({
        page,
        perPage: 12,
        search,
      })
      return res
    },
    initialData,
  })

  const safeData: NoteListResponse = data || {
    notes: [],
    totalPages: 1,
    page,
  }

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox onSearch={setSearch} />

        <Pagination
          totalPages={safeData.totalPages}
          currentPage={page}
          onPageChange={setPage}
        />

        {isFetching && <span className={css.loading}>Loading...</span>}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>

      <LayoutNotes sidebar={<SidebarNotes />}>
        <NoteList notes={safeData.notes} />
      </LayoutNotes>
    </div>
  )
}
