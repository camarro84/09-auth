'use client'

import { create } from 'zustand'
import { NoteTag } from '@/types/note'

type NoteDraftState = {
  title: string
  content: string
  tag: NoteTag
  setTitle: (v: string) => void
  setContent: (v: string) => void
  setTag: (v: NoteTag) => void
  reset: () => void
}

export const useNoteDraftStore = create<NoteDraftState>((set) => ({
  title: '',
  content: '',
  tag: NoteTag.Work,
  setTitle: (v) => set({ title: v }),
  setContent: (v) => set({ content: v }),
  setTag: (v) => set({ tag: v }),
  reset: () =>
    set({
      title: '',
      content: '',
      tag: NoteTag.Work,
    }),
}))
