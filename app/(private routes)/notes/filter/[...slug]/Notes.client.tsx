'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import NotesPage from '@/components/NotesPage/NotesPage'
import NoteList from '@/components/NoteList/NoteList'
import Loading from '@/app/loading'
import Error from './error'

import { fetchNotes, NoteParams } from '@/lib/api/clientApi'
import { NoteListResponse } from '@/types/note'

type NotesProps = {
  tag?: string
}

const Notes = ({ tag }: NotesProps) => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const params: NoteParams = {
    page,
    perPage: 10,
    search,
    ...(tag ? { tag } : {}),
  }

  const { data, isLoading, isError, error, isFetching } = useQuery<
    NoteListResponse,
    Error
  >({
    queryKey: ['notes', params],
    queryFn: () => fetchNotes(params),
  })

  if (isLoading) return <Loading />

  if (isError || !data) {
    // Використовуємо ?. і fallback, щоб TS не скаржився
    return (
      <Error
        error={error?.message ?? 'Unknown error'}
        value="the list of notes"
      />
    )
  }

  if (data.notes.length === 0) return <p>No notes found.</p>

  return (
    <NotesPage
      data={data}
      setPage={setPage}
      setSearch={setSearch}
      currentPage={page}
      isFetching={isFetching}
    >
      <NoteList notes={data.notes} />
    </NotesPage>
  )
}

export default Notes
