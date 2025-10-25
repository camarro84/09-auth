export type Note = {
  id: string
  title: string
  content: string
  tag: 'Work' | 'Personal' | 'Meeting' | 'Shopping' | 'Todo'
  createdAt: string
  updatedAt: string
}

export type NoteListResponse = {
  notes: Note[]
  totalPages: number
  page: number
}
