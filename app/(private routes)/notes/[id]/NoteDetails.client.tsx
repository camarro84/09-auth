'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchNoteById } from '@/lib/api/clientApi'
import type { Note } from '@/types/note'

type Props = {
  params: {
    id: string
  }
}

export default function NoteDetailsClient({ params }: Props) {
  const { id } = params

  const { data, isLoading, isError } = useQuery<Note>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  })

  if (isLoading) {
    return (
      <section>
        <p>Loading...</p>
      </section>
    )
  }

  if (isError || !data) {
    return (
      <section>
        <p>Error loading note</p>
      </section>
    )
  }

  return (
    <section>
      <article>
        <h2>{data.title}</h2>
        <p>{data.content}</p>
        <p>{data.tag}</p>
      </article>
    </section>
  )
}
