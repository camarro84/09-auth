'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { useDebouncedCallback } from 'use-debounce'
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
  const [searchValue, setSearchValue] = useState<string>('')

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchValue(value)
    setPage(1)
  }, 300)

  const handleSearch = useCallback(
    (value: string) => {
      debouncedSearch(value)
    },
    [debouncedSearch],
  )

  const { data, isLoading, isError } = useQuery<NoteListResponse>({
    queryKey: ['notes', { tag: tag ?? null, page, searchValue }],
    queryFn: () =>
      fetchNotes({
        tag: tag ?? undefined,
        page,
        search: searchValue,
        perPage: 12,
      }),
  })

  if (isLoading) {
    return (
      <section>
        <div>
          <Link href="/notes/action/create">Create Note</Link>
        </div>
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
          <Link href="/notes/action/create">Create Note</Link>
        </div>
        <div>
          <SearchBox onSearch={handleSearch} />
        </div>
        <p>Error loading notes</p>
      </section>
    )
  }

  const hasNotes = Array.isArray(data.notes) && data.notes.length > 0

  return (
    <section>
      <div>
        <Link href="/notes/action/create">Create Note</Link>
      </div>

      <div>
        <SearchBox onSearch={handleSearch} />
      </div>

      {hasNotes ? (
        <>
          <NoteList notes={data.notes} />

          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        </>
      ) : (
        <p>No notes found</p>
      )}
    </section>
  )
}
