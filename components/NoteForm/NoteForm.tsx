'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNoteDraftStore } from '@/lib/store/noteStore'
import { NoteDraft, NoteTag } from '@/types/note'
import { createNote } from '@/lib/api/clientApi'
import css from './NoteForm.module.css'

type Props = {
  onSuccessRedirect?: string
}

export default function NoteForm({ onSuccessRedirect = '/notes' }: Props) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { title, content, tag, setTitle, setContent, setTag, reset } =
    useNoteDraftStore()

  const [error, setError] = useState<string>('')

  function validateForm(values: NoteDraft) {
    if (!values.title.trim()) {
      return 'Title is required'
    }
    if (!values.content.trim()) {
      return 'Content is required'
    }
    if (!Object.values(NoteTag).includes(values.tag)) {
      return 'Tag is invalid'
    }
    return ''
  }

  const mutation = useMutation({
    mutationFn: (values: NoteDraft) => createNote(values),
    onSuccess: async () => {
      reset()
      await queryClient.invalidateQueries({ queryKey: ['notes'] })
      router.push(onSuccessRedirect)
      router.refresh()
    },
    onError: () => {
      setError('Failed to create note')
    },
  })

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    const values: NoteDraft = {
      title,
      content,
      tag,
    }

    const validationError = validateForm(values)
    if (validationError) {
      setError(validationError)
      return
    }

    mutation.mutate(values)
  }

  function handleChangeTitle(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value)
  }

  function handleChangeContent(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value)
  }

  function handleChangeTag(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as NoteTag
    setTag(value)
  }

  function handleCancel() {
    router.back()
  }

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          className={css.input}
          value={title}
          onChange={handleChangeTitle}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          className={css.textarea}
          value={content}
          onChange={handleChangeContent}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={tag}
          onChange={handleChangeTag}
          required
        >
          <option value={NoteTag.Work}>Work</option>
          <option value={NoteTag.Personal}>Personal</option>
          <option value={NoteTag.Meeting}>Meeting</option>
          <option value={NoteTag.Shopping}>Shopping</option>
          <option value={NoteTag.Todo}>Todo</option>
        </select>
      </div>

      <div className={css.actions}>
        <button type="submit" className={css.submitButton}>
          Save
        </button>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>

      {error && <p className={css.error}>{error}</p>}
    </form>
  )
}
