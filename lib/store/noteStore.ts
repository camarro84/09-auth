'use client'

import { NoteDraft, NoteTag } from '@/types/note'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type NoteDraftStore = {
  draft: NoteDraft
  setDraft: (note: NoteDraft) => void
  clearDraft: () => void
}

const initialDraft = {
  title: '',
  content: '',
  tag: NoteTag.Todo,
}

export const useNoteDraftStore = create<NoteDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) => set(() => ({ draft: note })),
      clearDraft: () => set(() => ({ draft: initialDraft })),
    }),
    {
      name: 'note-draft',
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
)
