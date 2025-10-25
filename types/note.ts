export type NoteTag = 'Work' | 'Personal' | 'Meeting' | 'Shopping' | 'Todo'

export type Note = {
  id: string
  title: string
  content: string
  tag: NoteTag
  createdAt: string
  updatedAt: string
}

export type NoteListResponse = {
  notes: Note[]
  page: number
  totalPages: number
}
