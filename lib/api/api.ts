import axios from 'axios'

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || 'https://notehub-api.goit.study'

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export type GetNotesParams = {
  search?: string
  tag?: 'Work' | 'Personal' | 'Meeting' | 'Shopping' | 'Todo'
  page?: number
  perPage?: number
  sortBy?: 'created' | 'updated'
}
