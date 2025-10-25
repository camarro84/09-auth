import { cookies } from 'next/headers'
import { api } from './api'
import type { User } from '@/types/user'
import type { NoteListResponse, Note } from '@/types/note'

async function buildCookieHeader() {
  const cookieStore = await cookies()
  const all = cookieStore.getAll()
  return all
    .map(
      ({ name, value }: { name: string; value: string }) => `${name}=${value}`,
    )
    .join('; ')
}

export async function checkSessionServer(): Promise<User | null> {
  try {
    const cookieHeader = await buildCookieHeader()

    const res = await api.get<User | null>('/auth/session', {
      headers: {
        Cookie: cookieHeader,
      },
      withCredentials: true,
    })

    return res.data || null
  } catch {
    return null
  }
}

export async function getMeServer(): Promise<User | null> {
  try {
    const cookieHeader = await buildCookieHeader()

    const res = await api.get<User>('/users/me', {
      headers: {
        Cookie: cookieHeader,
      },
      withCredentials: true,
    })

    return res.data
  } catch {
    return null
  }
}

export async function fetchNotesServer(params?: {
  page?: number
  perPage?: number
  search?: string
  tag?: string
}): Promise<NoteListResponse> {
  const cookieHeader = await buildCookieHeader()

  const res = await api.get<NoteListResponse>('/notes', {
    headers: {
      Cookie: cookieHeader,
    },
    withCredentials: true,
    params: {
      page: params?.page ?? 1,
      perPage: params?.perPage ?? 12,
      search: params?.search ?? '',
      tag: params?.tag ?? '',
    },
  })

  return res.data
}

export async function fetchNoteByIdServer(id: string): Promise<Note | null> {
  try {
    const cookieHeader = await buildCookieHeader()

    const res = await api.get<Note>(`/notes/${id}`, {
      headers: {
        Cookie: cookieHeader,
      },
      withCredentials: true,
    })

    return res.data
  } catch {
    return null
  }
}
