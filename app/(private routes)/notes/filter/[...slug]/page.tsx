import { fetchNotesServer } from '@/lib/api/serverApi'
import Notes from './Notes.client'
import type { NoteListResponse } from '@/types/note'

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>
  searchParams?: Promise<{ q?: string | string[] }>
}) {
  const resolvedParams = await params
  const resolvedSearch = await searchParams

  const tagRaw = resolvedParams?.slug?.[0]
  const tag = !tagRaw || tagRaw === 'all' ? undefined : tagRaw
  const qParam = resolvedSearch?.q
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
