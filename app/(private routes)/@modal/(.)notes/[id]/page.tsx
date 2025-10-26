import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query'
import { fetchNoteByIdServer } from '@/lib/api/serverApi'
import NotePreviewClient from './NotePreview.client'

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function NoteModalPage({ params }: Props) {
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
    <HydrationBoundary state={dehydratedState}>
      <NotePreviewClient id={id} />
    </HydrationBoundary>
  )
}
