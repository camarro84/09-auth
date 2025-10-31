'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNoteDraftStore } from '@/lib/store/noteStore'
import { NoteDraft, NoteTag } from '@/types/note'
import { createNote } from '@/lib/api/clientApi'
import css from './NoteForm.module.css'

type Props = {
  onSuccessRedirect?: string
}

const KEY_TITLE = 'draft_note_title'
const KEY_CONTENT = 'draft_note_content'
const KEY_TAG = 'draft_note_tag'

export default function NoteForm({ onSuccessRedirect = '/notes' }: Props) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { title, content, tag, setTitle, setContent, setTag, reset } = useNoteDraftStore()

  const [error, setError] = useState('')

  useEffect(() => {
    const t = localStorage.getItem(KEY_TITLE)
    const c = localStorage.getItem(KEY_CONTENT)
    const g = localStorage.getItem(KEY_TAG)
    if (t !== null) setTitle(t)
    if (c !== null) setContent(c)
    if (g) setTag(g as NoteTag)
  }, [setTitle, setContent, setTag])

  useEffect(() => {
    localStorage.setItem(KEY_TITLE, title)
  }, [title])

  useEffect(() => {
    localStorage.setItem(KEY_CONTENT, content)
  }, [content])

  useEffect(() => {
    if (tag) localStorage.setItem(KEY_TAG, tag)
    else localStorage.removeItem(KEY_TAG)
  }, [tag])

  function validateForm(values: NoteDraft) {
    if (!values.title.trim()) return 'Title is required'
    if (!values.content.trim()) return 'Content is required'
    if (!Object.values(NoteTag).includes(values.tag)) return 'Tag is invalid'
    return ''
  }

  const mutation = useMutation({
    mutationFn: (values: NoteDraft) => createNote(values),
    onSuccess: async () => {
      reset()
      localStorage.removeItem(KEY_TITLE)
      localStorage.removeItem(KEY_CONTENT)
      localStorage.removeItem(KEY_TAG)
      await queryClient.invalidateQueries({ queryKey: ['notes'] })
      router.push(onSuccessRedirect)
      router.refresh()
    },
    onError: () => {
      setError('Failed to create note')
    },
  })

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const values: NoteDraft = { title, content, tag }
    const validationError = validateForm(values)
    if (validationError) {
      setError(validationError)
      return
    }
    mutation.mutate(values)
  }

  function handleCancel() {
    router.back()
  }

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input id="title" name="title" className={css.input} value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea id="content" name="content" className={css.textarea} value={content} onChange={(e) => setContent(e.target.value)} required />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select id="tag" name="tag" className={css.select} value={tag} onChange={(e) => setTag(e.target.value as NoteTag)} required>
          <option value={NoteTag.Work}>Work</option>
          <option value={NoteTag.Personal}>Personal</option>
          <option value={NoteTag.Meeting}>Meeting</option>
          <option value={NoteTag.Shopping}>Shopping</option>
          <option value={NoteTag.Todo}>Todo</option>
        </select>
      </div>

      <div className={css.actions}>
        <button type="submit" className={css.submitButton}>Save</button>
        <button type="button" className={css.cancelButton} onClick={handleCancel}>Cancel</button>
      </div>

      {error && <p className={css.error}>{error}</p>}
    </form>
  )
}
