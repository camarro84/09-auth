'use client'

import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchNotes } from '@/lib/api/clientApi'
import type { NoteListResponse } from '@/types/note'
import NoteList from '@/components/NoteList/NoteList'
import Pagination from '@/components/Pagination/Pagination'
import SearchBox from '@/components/SearchBox/SearchBox'

type AllowedTag = 'Work' | 'Personal' | 'Meeting' | 'Shopping' | 'Todo'

type Props = {
  tag?: AllowedTag
}

export default function Notes({ tag }: Props) {
  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  const { data, isLoading, isError } = useQuery<NoteListResponse>({
    queryKey: ['notes', { tag: tag ?? 'all', page, search }],
    queryFn: () =>
      fetchNotes({
        tag: tag ?? 'all',
        page,
        search,
        perPage: 8,
      }),
  })

  if (isLoading) {
    return (
      <section>
        <div>
          <SearchBox onSearch={handleSearch} />
        </div>
        <p>Loading...</p>
      </section>
    )
  }

  if (isError || !data) {
    return (
      <section>
        <div>
          <SearchBox onSearch={handleSearch} />
        </div>
        <p>Error loading notes</p>
      </section>
    )
  }

  return (
    <section>
      <div>
        <SearchBox onSearch={handleSearch} />
      </div>

      <NoteList notes={data.notes} />

      <Pagination
        currentPage={data.page}
        totalPages={data.totalPages}
        onPageChange={setPage}
      />
    </section>
  )
}
