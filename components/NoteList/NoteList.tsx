import css from './NoteList.module.css'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Note } from '@/types/note'
import Link from 'next/link'
import Button from '../Button/Button'
import { deleteNote } from '@/lib/api/clientApi'

type Props = {
  notes: Note[]
}

const NoteList = ({ notes }: Props) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<Note, unknown, string>({
    mutationFn: (noteId: string) => deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  const handleDeleteNote = (noteId: string) => {
    mutation.mutate(noteId)
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li className={css.listItem} key={note.id}>
          <Link href={`/notes/${note.id}`} className={css.content}>
            <p className={css.title}>{note.title}</p>
            <p className={css.contentText}>{note.content}</p>
          </Link>
          <div className={css.footer}>
            <p className={css.tag}>{note.tag}</p>
            <Button
              typeBtn="button"
              className={css.button}
              onClick={() => handleDeleteNote(note.id)}
              value="Delete"
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

export default NoteList
