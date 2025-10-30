'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import css from '@/components/NotesPage/NotesPage.module.css'
import SearchBox from '@/components/SearchBox/SearchBox'
import Pagination from '@/components/Pagination/Pagination'
import NoteList from '@/components/NoteList/NoteList'
import type { NoteListResponse } from '@/types/note'
import { fetchNotes } from '@/lib/api/clientApi'

const MAP: Record<string, string> = {
  work: 'Work',
  personal: 'Personal',
  meeting: 'Meeting',
  shopping: 'Shopping',
  todo: 'Todo',
}

export default function Notes() {
  const params = useParams<{ slug?: string[] }>()
  const raw = (params?.slug?.[0] || 'all').toLowerCase()
  const tag = raw === 'all' ? undefined : MAP[raw]

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')

  useEffect(() => {
    const id = setTimeout(() => {
      setDebounced(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(id)
  }, [search])

  const qk = useMemo(() => ['notes', { page, search: debounced, tag }] as const, [page, debounced, tag])

  const { data, isFetching, isError, error } = useQuery<NoteListResponse>({
    queryKey: qk,
    queryFn: async () => {
      const res = await fetchNotes({ page, perPage: 12, search: debounced, tag })
      const total = (res as any).total ?? 0
      const perPage = (res as any).perPage ?? 12
      const totalPages =
        typeof (res as any).totalPages === 'number'
          ? (res as any).totalPages
          : Math.max(1, Math.ceil(total / perPage))
      return { notes: res.notes ?? [], page: res.page ?? page, totalPages }
    },
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
