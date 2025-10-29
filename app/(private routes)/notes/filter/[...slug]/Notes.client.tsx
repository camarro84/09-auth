'use client'

import NotesPage from '@/components/NotesPage/NotesPage'
import type { NoteListResponse } from '@/types/note'

type Props = {
  initialData: NoteListResponse
}

export default function Notes({ initialData }: Props) {
  return <NotesPage initialData={initialData} />
}
