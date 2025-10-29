import { cookies } from 'next/headers'
import { api } from './api'
import type { AxiosResponse } from 'axios'
import type { User } from '@/types/user'
import type { Note, NoteListResponse } from '@/types/note'

async function getCookieHeader() {
  const jar = await cookies()
  const list = jar.getAll().map((c: { name: string; value: string }) => {
    return `${c.name}=${c.value}`
  })
  return list.join('; ')
}

export async function checkSessionServer(): Promise<
  AxiosResponse<User | null> | null
> {
  try {
    const res = await api.get<User | null>('/auth/session', {
      headers: {
        Cookie: await getCookieHeader(),
      },
      withCredentials: true,
    })
    return res
  } catch {
    return null
  }
}

export async function getMeServer(): Promise<User | null> {
  try {
    const res = await api.get<User>('/users/me', {
      headers: {
        Cookie: await getCookieHeader(),
      },
      withCredentials: true,
    })
    return res.data || null
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
  try {
    const res = await api.get<NoteListResponse>('/notes', {
      params,
      headers: {
        Cookie: await getCookieHeader(),
      },
      withCredentials: true,
    })
    return res.data || null
  } catch {
    return null
  }
}

export async function fetchNoteByIdServer(id: string): Promise<Note | null> {
  try {
    const res = await api.get<Note>(`/notes/${id}`, {
      headers: {
        Cookie: await getCookieHeader(),
      },
      withCredentials: true,
    })
    return res.data || null
  } catch {
    return null
  }
}
