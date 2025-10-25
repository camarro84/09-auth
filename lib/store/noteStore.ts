'use client'

import { create } from 'zustand'
import type { Note } from '@/types/note'

type NoteStoreState = {
  notes: Note[]
  setNotes: (notes: Note[]) => void
  clear: () => void
}

export const useNoteStore = create<NoteStoreState>((set) => ({
  notes: [],
  setNotes: (notes: Note[]) => set({ notes }),
  clear: () => set({ notes: [] }),
}))
