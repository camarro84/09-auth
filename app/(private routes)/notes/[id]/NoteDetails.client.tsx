'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import Loading from '@/app/loading'
import Error from './error'
import NotePreview from '@/components/NotePreview/NotePreview'
import { fetchNoteById } from '@/lib/api/clientApi'
import { Note } from '@/types/note'

type Props = {
  onClose: () => void
}

const Details = ({ onClose }: Props) => {
  const params = useParams()
  const noteId = params.id as string

  const { data, isLoading, isError, error } = useQuery<Note, Error>({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId), // ⚡ передаємо тільки рядок
    enabled: !!noteId,
  })

  if (isLoading) return <Loading />

  if (isError || !data) {
    const safeError = error instanceof Error ? error.message : 'Unknown error'
    return <Error error={safeError} value="note details" />
  }

  return <NotePreview data={data} onClose={onClose} />
}

export default Details
