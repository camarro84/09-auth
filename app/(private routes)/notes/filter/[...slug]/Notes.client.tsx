'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import css from '@/components/NotesPage/NotesPage.module.css'
import SearchBox from '@/components/SearchBox/SearchBox'
import Pagination from '@/components/Pagination/Pagination'
import NoteList from '@/components/NoteList/NoteList'
import type { NoteListResponse } from '@/types/note'
import { fetchNotes } from '@/lib/api/clientApi'

type Props = {
  initialData: NoteListResponse
  tag?: string
}

export default function Notes({ initialData, tag }: Props) {
  const [page, setPage] = useState(initialData.page || 1)
  const [search, setSearch] = useState('')

  const { data, isFetching, isError, error } = useQuery({
    queryKey: ['notes', { page, search, tag }],
    queryFn: async () => {
      const res = await fetchNotes({ page, perPage: 12, search, tag })
      const total = (res as any).total ?? 0
      const perPage = (res as any).perPage ?? 12
      const totalPages =
        typeof (res as any).totalPages === 'number'
          ? (res as any).totalPages
          : Math.max(1, Math.ceil(total / perPage))
      return {
        notes: res.notes ?? [],
        page: res.page ?? page,
        totalPages,
      } as NoteListResponse
    },
    initialData,
  })

  const safe = data || { notes: [], page, totalPages: 1 }

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox onSearch={setSearch} />
        <Pagination totalPages={safe.totalPages} currentPage={page} onPageChange={setPage} />
        {isFetching && <span className={css.loading}>Loading...</span>}
        <Link href="/notes/action/create" className={css.button}>Create note +</Link>
      </div>
      <div className={css.content}>
        {isError && <p className={css.errorText}>{(error as Error)?.message ?? 'Failed to load'}</p>}
        <NoteList notes={safe.notes} />
      </div>
    </div>
  )
}
