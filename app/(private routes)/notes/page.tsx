import { fetchNotesServer } from '@/lib/api/serverApi'
import NotesPage from '@/components/NotesPage/NotesPage'

export default async function NotesRoutePage() {
  const data = await fetchNotesServer({
    page: 1,
    perPage: 12,
  })

  return <NotesPage initialData={data} />
}
