'use client'

import Link from 'next/link'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteNote } from '@/lib/api/clientApi'
import type { Note } from '@/types/note'
import css from './NoteList.module.css'

type Props = {
  notes: Note[]
}

export default function NoteList({ notes }: Props) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (noteId: string) => deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  const handleDelete = (id: string) => {
    mutation.mutate(id)
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li className={css.listItem} key={note.id}>
          <Link href={`/notes/${note.id}`} className={css.content}>
            <p className={css.title}>{note.title}</p>
            <p className={css.content}>{note.content}</p>
          </Link>

          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>

            <button
              type="button"
              className={css.button}
              onClick={() => handleDelete(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
