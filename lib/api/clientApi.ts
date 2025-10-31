import { api } from './api'
import type { User } from '@/types/user'
import type { Note, NoteListResponse } from '@/types/note'

export type AuthCredentials = {
  email: string
  password: string
}

export type RegisterData = {
  email: string
  password: string
}

function cleanParams<T extends Record<string, unknown>>(obj: T) {
  const out: Record<string, unknown> = {}
  for (const k of Object.keys(obj)) {
    const v = obj[k as keyof T]
    if (v !== undefined && v !== null && v !== '') out[k] = v
  }
  return out
}

export async function register(data: RegisterData): Promise<User> {
  const res = await api.post<User>('/auth/register', {
    email: data.email,
    password: data.password,
  })
  return res.data
}

export async function login(data: AuthCredentials): Promise<User> {
  const res = await api.post<User>('/auth/login', data)
  return res.data
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}

export async function checkSession(): Promise<User | null> {
  const res = await api.get<User | null>('/auth/session')
  return res.data ?? null
}

export async function getMe(): Promise<User> {
  const res = await api.get<User>('/users/me')
  return res.data
}

export async function updateMe(payload: { username: string }): Promise<User> {
  const res = await api.patch<User>('/users/me', payload)
  return res.data
}

export async function fetchNotes(params: {
  page?: number
  perPage?: number
  search?: string
  tag?: string
}): Promise<NoteListResponse> {
  const res = await api.get<NoteListResponse>('/notes', { params: cleanParams(params) })
  return res.data
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await api.get<Note>(`/notes/${id}`)
  return res.data
}

export async function createNote(data: {
  title: string
  content: string
  tag: string
}): Promise<Note> {
  const res = await api.post<Note>('/notes', data)
  return res.data
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await api.delete<Note>(`/notes/${id}`)
  return res.data
}
