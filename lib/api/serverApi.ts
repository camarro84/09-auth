import { cookies } from 'next/headers'
import { api } from './api'
import { User } from '@/types/user'
import { Note, NoteListResponse } from '@/types/note'

// ================= HELPERS =================
async function getAuthHeaders() {
  const cookieStore = await cookies() // ✅ додаємо await
  const accessToken = cookieStore.get('accessToken')?.value
  const refreshToken = cookieStore.get('refreshToken')?.value

  return {
    Cookie: `accessToken=${accessToken ?? ''}; refreshToken=${refreshToken ?? ''}`,
  }
}

// ================= AUTH =================

// Перевірка сесії через сервер
export async function serverCheckSession(): Promise<User | null> {
  try {
    const headers = await getAuthHeaders()
    const { data } = await api.get<User | null>('/auth/session', { headers })
    return data
  } catch {
    return null
  }
}

// Отримати поточного користувача
export async function serverGetMe(): Promise<User | null> {
  try {
    const headers = await getAuthHeaders()
    const { data } = await api.get<User>('/users/me', { headers })
    return data
  } catch {
    return null
  }
}

// ================= NOTES =================

// Отримати список нотаток з параметрами
export async function serverFetchNotes(params?: {
  search?: string
  page?: number
  tag?: string
}): Promise<NoteListResponse | null> {
  try {
    const headers = await getAuthHeaders()
    const { data } = await api.get<NoteListResponse>('/notes', {
      headers,
      params,
    })
    return data
  } catch {
    return null
  }
}

// Отримати нотатку за id
export async function serverFetchNoteById(
  noteId: string,
): Promise<Note | null> {
  try {
    const headers = await getAuthHeaders()
    const { data } = await api.get<Note>(`/notes/${noteId}`, { headers })
    return data
  } catch {
    return null
  }
}
