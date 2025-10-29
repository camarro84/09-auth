import axios, { AxiosResponse } from 'axios'
import { cookies } from 'next/headers'
import type { Note } from '@/types/note'
import type { User } from '@/types/user'
import { api } from './api'

type FetchNotesParams = {
  page?: number
  perPage?: number
  query?: string
  tag?: string
}

export async function fetchNotesServer(
  params: FetchNotesParams = {}
): Promise<{ notes: Note[]; total: number; page: number; perPage: number }> {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()
  const res = await api.get<{ notes: Note[]; total: number; page: number; perPage: number }>(
    '/notes',
    { params, headers: { Cookie: cookieHeader } }
  )
  return res.data
}

export async function fetchNoteByIdServer(id: string): Promise<Note> {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()
  const res = await api.get<Note>(`/notes/${id}`, { headers: { Cookie: cookieHeader } })
  return res.data
}

export async function getMeServer(): Promise<User | null> {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()
  const res = await api.get<User | null>('/users/me', {
    headers: { Cookie: cookieHeader },
    validateStatus: () => true,
  })
  return res.data ?? null
}

export async function checkSessionServer(
  cookieHeaderOverride?: string
): Promise<AxiosResponse<User | null>> {
  const cookieHeader = cookieHeaderOverride ?? (await cookies()).toString()
  const instance = axios.create({
    baseURL: api.defaults.baseURL,
    withCredentials: true,
    headers: { Cookie: cookieHeader },
    validateStatus: () => true,
  })
  const res = await instance.get<User | null>('/auth/session')
  return res
}
