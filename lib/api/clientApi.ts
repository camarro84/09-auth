import axios from 'axios'
import { User } from '@/types/user'
import { NoteListResponse } from '@/types/note'

// ================= BASE CONFIG =================
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://notehub-api.goit.study',
  withCredentials: true, // ✅ cookies автоматично передаються
  headers: {
    'Content-Type': 'application/json',
  },
})

// ================= AUTH TYPES =================
export type UserLogin = {
  email: string
  password: string
}

export async function register(data: UserLogin) {
  const { data: user } = await api.post('/auth/register', data) // або ваш endpoint для реєстрації
  return user
}
// ================= AUTH FUNCTIONS =================

// 🔹 Логін (HttpOnly cookies)
export async function login(data: UserLogin) {
  await api.post('/auth/login', data) // cookies ставляться сервером
}

// 🔹 Логаут
export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}

// 🔹 Перевірка активної сесії
export async function checkSession(): Promise<User | null> {
  try {
    const { data } = await api.get<User | null>('/auth/session')
    return data
  } catch {
    return null
  }
}

// 🔹 Отримати поточного користувача
export async function getMe(): Promise<User | null> {
  try {
    const { data } = await api.get<User>('/users/me')
    return data
  } catch {
    return null
  }
}

// ================= NOTES =================

export type NoteParams = {
  search?: string
  page?: number
  perPage?: number
  tag?: string
}

export async function fetchNotes(
  params?: NoteParams,
): Promise<NoteListResponse> {
  const { data } = await api.get<NoteListResponse>('/notes', { params })
  return data
}

export async function fetchNoteById(noteId: string) {
  const { data } = await api.get(`/notes/${noteId}`)
  return data
}

export async function createNote(note: {
  title: string
  content: string
  tag: string
}) {
  const { data } = await api.post('/notes', note)
  return data
}

export async function deleteNote(noteId: string) {
  const { data } = await api.delete(`/notes/${noteId}`)
  return data
}
