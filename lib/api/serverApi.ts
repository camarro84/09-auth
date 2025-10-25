import { cookies } from 'next/headers'
import { api } from './api'
import type { User } from '@/types/user'
import type { Note, NoteListResponse } from '@/types/note'

async function cookieHeader() {
  const jar = await cookies()
  return jar
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ')
}

export async function checkSessionServer(): Promise<User | null> {
  try {
    const res = await api.get<User | null>('/auth/session', {
      headers: { Cookie: await cookieHeader() },
      withCredentials: true,
    })
    return res.data ?? null
  } catch {
    return null
  }
}

export async function getMeServer(): Promise<User | null> {
  try {
    const res = await api.get<User>('/users/me', {
      headers: { Cookie: await cookieHeader() },
      withCredentials: true,
    })
    return res.data
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
      headers: { Cookie: await cookieHeader() },
      withCredentials: true,
    })
    return res.data
  } catch {
    return null
  }
}

export async function fetchNoteByIdServer(id: string): Promise<Note | null> {
  try {
    const res = await api.get<Note>(`/notes/${id}`, {
      headers: { Cookie: await cookieHeader() },
      withCredentials: true,
    })
    return res.data
  } catch {
    return null
  }
}
