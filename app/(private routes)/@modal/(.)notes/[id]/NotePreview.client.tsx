'use client'

import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Modal from '@/components/Modal/Modal'
import type { Note } from '@/types/note'
import { fetchNoteById } from '@/lib/api/clientApi'

type Props = {
  params: {
    id: string
  }
}

export default function NotePreview({ params }: Props) {
  const router = useRouter()
  const { id } = params

  const { data, isLoading, isError } = useQuery<Note>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  })

  const handleClose = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <Modal onClose={handleClose}>
        <p>Loading...</p>
      </Modal>
    )
  }

  if (isError || !data) {
    return (
      <Modal onClose={handleClose}>
        <p>Error loading note</p>
      </Modal>
    )
  }

  return (
    <Modal onClose={handleClose}>
      <article>
        <h2>{data.title}</h2>
        <p>{data.content}</p>
        <p>{data.tag}</p>
      </article>
    </Modal>
  )
}
