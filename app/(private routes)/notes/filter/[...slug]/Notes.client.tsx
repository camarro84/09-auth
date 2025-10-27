'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { useDebouncedCallback } from 'use-debounce'
import { fetchNotes } from '@/lib/api/clientApi'
import type { NoteListResponse } from '@/types/note'
import NoteList from '@/components/NoteList/NoteList'
import Pagination from '@/components/Pagination/Pagination'
import SearchBox from '@/components/SearchBox/SearchBox'
import LayoutNotes from '@/components/LayoutNotes/LayoutNotes'
import SidebarNotes from '@/components/SidebarNotes/SidebarNotes'

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
    [debouncedSearch]
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

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
  }

  const showList =
    !isLoading &&
    !isError &&
    data &&
    Array.isArray(data.notes) &&
    data.notes.length > 0

  return (
    <LayoutNotes sidebar={<SidebarNotes />}>
      <div
        style={{
          backgroundColor: '#f5f5f5',
          padding: '16px',
          borderRadius: '4px',
          border: '1px solid transparent',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '8px',
          }}
        >
          <div style={{ flex: '1 1 320px', maxWidth: '400px' }}>
            <SearchBox onSearch={handleSearch} />
          </div>

          <div style={{ flexShrink: 0 }}>
            <Link
              href="/notes/action/create"
              style={{
                display: 'inline-block',
                backgroundColor: '#0d6efd',
                color: '#fff',
                borderRadius: '4px',
                fontSize: '16px',
                lineHeight: 1.2,
                padding: '8px 12px',
                border: '1px solid #0b5ed7',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Create note +
            </Link>
          </div>
        </div>

        <div
          style={{
            borderBottom: '1px solid #d1d5db',
            marginBottom: '12px',
          }}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '12px',
          }}
        >
          {data && (
            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        <div
          style={{
            borderTop: '1px solid #d1d5db',
            marginBottom: '12px',
          }}
        />

        {isLoading && <p>Loading...</p>}

        {(isError || !data) && !isLoading && <p>Error loading notes</p>}

        {showList ? (
          <NoteList notes={data.notes} />
        ) : (
          !isLoading &&
          !isError && <p style={{ color: '#6b7280' }}>No notes found</p>
        )}
      </div>
    </LayoutNotes>
  )
}
