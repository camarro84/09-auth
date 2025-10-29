import { fetchNotesServer } from '@/lib/api/serverApi'
import Notes from './Notes.client'
import type { NoteListResponse } from '@/types/note'

type Props = {
  params: { slug: string[] }
  searchParams?: { q?: string | string[] }
}

export default async function Page({ params, searchParams }: Props) {
  const tagRaw = params?.slug?.[0]
  const tag = !tagRaw || tagRaw === 'all' ? undefined : tagRaw
  const qParam = searchParams?.q
  const query = typeof qParam === 'string' ? qParam : undefined

  const data = await fetchNotesServer({
    page: 1,
    perPage: 12,
    tag,
    query,
  })

  const page = data?.page ?? 1
  const perPage = data?.perPage ?? 12
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / perPage))

  const initialData: NoteListResponse = {
    notes: data?.notes ?? [],
    page,
    totalPages,
  }

  return <Notes initialData={initialData} />
}
