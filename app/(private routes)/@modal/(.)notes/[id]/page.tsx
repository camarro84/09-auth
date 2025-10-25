'use client'

import { useEffect, useState } from 'react'
import { fetchNoteById } from '@/lib/api/clientApi'
import type { Note } from '@/types/note'
import { useRouter } from 'next/navigation'

type NoteModalPageProps = {
  params: {
    id: string
  }
}

export default function NoteModalPage({ params }: NoteModalPageProps) {
  const router = useRouter()
  const { id } = params

  const [note, setNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchNoteById(id)
        setNote(data as Note)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  const handleClose = () => {
    router.back()
  }

  if (loading) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'grid',
          placeItems: 'center',
          zIndex: 1000,
        }}
      >
        <div
          style={{
            backgroundColor: '#fff',
            color: '#000',
            borderRadius: '8px',
            padding: '24px',
            minWidth: '320px',
            maxWidth: '480px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.5)',
          }}
        >
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!note) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'grid',
          placeItems: 'center',
          zIndex: 1000,
        }}
      >
        <div
          style={{
            backgroundColor: '#fff',
            color: '#000',
            borderRadius: '8px',
            padding: '24px',
            minWidth: '320px',
            maxWidth: '480px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.5)',
          }}
        >
          <p>Note not found</p>
          <button
            type="button"
            onClick={handleClose}
            style={{
              marginTop: '16px',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #000',
            }}
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          color: '#000',
          borderRadius: '8px',
          padding: '24px',
          minWidth: '320px',
          maxWidth: '480px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.5)',
        }}
      >
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 600,
            marginBottom: '12px',
          }}
        >
          {note.title}
        </h2>

        <p
          style={{
            fontSize: '14px',
            lineHeight: 1.4,
            whiteSpace: 'pre-wrap',
            marginBottom: '16px',
          }}
        >
          {note.content}
        </p>

        <p
          style={{
            fontSize: '12px',
            color: '#555',
          }}
        >
          Tag: {note.tag}
        </p>

        <button
          type="button"
          onClick={handleClose}
          style={{
            marginTop: '16px',
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #000',
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}
