'use client'

import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Modal from '@/components/Modal/Modal'
import type { Note } from '@/types/note'
import { fetchNoteById } from '@/lib/api/clientApi'

type Props = {
  id: string
}

export default function NotePreviewClient({ id }: Props) {
  const router = useRouter()

  const { data, isLoading, isError } = useQuery<Note>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  })

  const handleClose = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <Modal open={true} onClose={handleClose}>
        <p
          style={{
            fontSize: '16px',
            lineHeight: 1.5,
            margin: 0,
            color: '#000',
          }}
        >
          Loading...
        </p>
      </Modal>
    )
  }

  if (isError || !data) {
    return (
      <Modal open={true} onClose={handleClose}>
        <p
          style={{
            fontSize: '16px',
            lineHeight: 1.5,
            margin: 0,
            color: '#000',
          }}
        >
          Error loading note
        </p>
      </Modal>
    )
  }

  // если API возвращает ещё createdAt/updatedAt — можешь отрисовать. если нет, просто не показывай блок "Created"
  // оставлю как пример:
  const createdAt =
    (data as any).createdAt ||
    (data as any).created ||
    null // если в типах нет даты - ок не рендерим

  return (
    <Modal open={true} onClose={handleClose}>
      <article>
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 600,
            lineHeight: 1.4,
            color: '#000',
            margin: 0,
            marginBottom: '16px',
          }}
        >
          {data.title}
        </h2>

        <p
          style={{
            fontSize: '16px',
            lineHeight: 1.5,
            color: '#000',
            margin: 0,
            marginBottom: '16px',
          }}
        >
          {data.content}
        </p>

        <p
          style={{
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: 1.4,
            color: '#000',
            margin: 0,
            marginBottom: createdAt ? '8px' : '0',
          }}
        >
          <span style={{ fontWeight: 600 }}>Tag:</span>{' '}
          <span>{data.tag}</span>
        </p>

        {createdAt && (
          <p
            style={{
              fontSize: '14px',
              lineHeight: 1.4,
              color: '#000',
              margin: 0,
            }}
          >
            <span style={{ fontWeight: 600 }}>Created:</span>{' '}
            <span>{createdAt}</span>
          </p>
        )}
      </article>
    </Modal>
  )
}
