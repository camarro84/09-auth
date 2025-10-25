export enum NoteTag {
  Work = 'Work',
  Personal = 'Personal',
  Meeting = 'Meeting',
  Shopping = 'Shopping',
  Todo = 'Todo',
}

export type Note = {
  id: string
  title: string
  content: string
  tag: NoteTag
  createdAt: string
  updatedAt: string
}

export type NoteDraft = {
  title: string
  content: string
  tag: NoteTag
}

export type NoteListResponse = {
  notes: Note[]
  page: number
  totalPages: number
}
