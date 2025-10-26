import { cookies } from 'next/headers'
import type { User } from '@/types/user'
import type { Note, NoteListResponse } from '@/types/note'

const BASE_URL = 'https://notehub-api.goit.study'

async function buildCookieHeader() {
  const jar = await cookies()
  const all = jar.getAll()
  return all
    .map(
      ({ name, value }: { name: string; value: string }) => `${name}=${value}`,
    )
    .join('; ')
}

export async function checkSessionServer(): Promise<User | null> {
  const res = await fetch(`${BASE_URL}/auth/session`, {
    method: 'GET',
    headers: {
      cookie: await buildCookieHeader(),
    },
    cache: 'no-store',
    credentials: 'include',
  })

  if (!res.ok) {
    return null
  }

  try {
    const data = await res.json()
    return data || null
  } catch {
    return null
  }
}

export async function getMeServer(): Promise<User | null> {
  const res = await fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      cookie: await buildCookieHeader(),
    },
    cache: 'no-store',
    credentials: 'include',
  })

  if (!res.ok) {
    return null
  }

  try {
    const data = await res.json()
    return data || null
  } catch {
    return null
  }
}

export async function fetchNotesServer(params: {
  page?: number
  perPage?: number
  search?: string
  tag?: string
}): Promise<NoteListResponse | null> {
  const query = new URLSearchParams()
  if (params.page !== undefined) query.set('page', String(params.page))
  if (params.perPage !== undefined) query.set('perPage', String(params.perPage))
  if (params.search) query.set('search', params.search)
  if (params.tag) query.set('tag', params.tag)

  const res = await fetch(`${BASE_URL}/notes?${query.toString()}`, {
    method: 'GET',
    headers: {
      cookie: await buildCookieHeader(),
    },
    cache: 'no-store',
    credentials: 'include',
  })

  if (!res.ok) {
    return null
  }

  const data = await res.json()
  return data || null
}

export async function fetchNoteByIdServer(id: string): Promise<Note | null> {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: 'GET',
    headers: {
      cookie: await buildCookieHeader(),
    },
    cache: 'no-store',
    credentials: 'include',
  })

  if (!res.ok) {
    return null
  }

  const data = await res.json()
  return data || null
}
