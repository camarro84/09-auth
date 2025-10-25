import axios from 'axios'
import type { User } from '@/types/user'
import type { NoteListResponse, Note } from '@/types/note'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function register(data: {
  username: string
  email: string
  password: string
}) {
  const res = await api.post('/auth/register', data)
  return res.data
}

export async function login(data: { email: string; password: string }) {
  const res = await api.post('/auth/login', data)
  return res.data
}

export async function logout() {
  const res = await api.post('/auth/logout')
  return res.data
}

export async function checkSession(): Promise<User | null> {
  const res = await api.get<User | null>('/auth/session')
  return res.data || null
}

export async function getMe(): Promise<User | null> {
  const res = await api.get<User>('/users/me')
  return res.data
}

export async function fetchNotes(params?: {
  page?: number
  perPage?: number
  search?: string
  tag?: string
}): Promise<NoteListResponse> {
  const res = await api.get<NoteListResponse>('/notes', { params })
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

export async function deleteNote(id: string): Promise<void> {
  await api.delete(`/notes/${id}`)
}

export { api }
