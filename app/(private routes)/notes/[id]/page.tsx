import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query'
import NoteDetailsClient from './NoteDetails.client'
import { fetchNoteByIdServer } from '@/lib/api/serverApi'

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function NotePage({ params }: Props) {
  const { id } = await params

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: async () => {
      const note = await fetchNoteByIdServer(id)
      if (!note) {
        throw new Error('Note not found')
      }
      return note
    },
  })

  const dehydratedState = dehydrate(queryClient)

  return (
    <main>
      <HydrationBoundary state={dehydratedState}>
        <NoteDetailsClient params={{ id }} />
      </HydrationBoundary>
    </main>
  )
}
