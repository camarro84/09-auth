import { fetchNoteByIdServer } from '@/lib/api/serverApi'
import NoteDetails from '@/components/NoteDetails/NoteDetails'

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function NotePage({ params }: Props) {
  const { id } = await params

  const note = await fetchNoteByIdServer(id)

  if (!note) {
    return (
      <main>
        <p>Note not found</p>
      </main>
    )
  }

  return (
    <main>
      <NoteDetails />
    </main>
  )
}
