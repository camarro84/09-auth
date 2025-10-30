import { notFound } from 'next/navigation'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { QueryClient } from '@tanstack/react-query'
import { fetchNotesServer } from '@/lib/api/serverApi'
import Notes from './Notes.client'

const SLUG_TO_TAG: Record<string, string> = {
  work: 'Work',
  personal: 'Personal',
  meeting: 'Meeting',
  shopping: 'Shopping',
  todo: 'Todo',
}

type Params = { slug?: string[] }
type SearchParams = { q?: string | string[]; page?: string | string[] }

export default async function Page(props: {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}) {
  const { slug } = await props.params
  const sp = await props.searchParams

  const raw = slug?.[0]?.toLowerCase() ?? 'all'
  if (raw !== 'all' && !SLUG_TO_TAG[raw]) return notFound()
  const tag = raw === 'all' ? undefined : SLUG_TO_TAG[raw]

  const qv = sp?.q
  const query = typeof qv === 'string' ? qv : Array.isArray(qv) ? qv[0] : undefined
  const pv = sp?.page
  const page = Math.max(1, Number(typeof pv === 'string' ? pv : Array.isArray(pv) ? pv[0] : 1) || 1)
  const perPage = 12

  const data = await fetchNotesServer({ page, perPage, tag, query })
  if (!data || !data.notes || data.notes.length === 0) return notFound()

  const total = data.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / (data.perPage ?? perPage)))

  const qc = new QueryClient()
  await qc.prefetchQuery({
    queryKey: ['notes', { page, search: query ?? '', tag }],
    queryFn: async () => {
      return {
        notes: data.notes,
        page: data.page ?? page,
        totalPages,
      }
    },
  })

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <Notes />
    </HydrationBoundary>
  )
}
