export type Note = {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  tag: string
}

export enum NoteTag {
  Work = 'Work',
  Personal = 'Personal',
  Meeting = 'Meeting',
  Shopping = 'Shopping',
  Todo = 'Todo',
}

export type NoteDraft = {
  title: string
  content: string
  tag: NoteTag
}

export type NoteListResponse = {
  notes: Note[]
  totalPages: number
}
