'use client'

import React, { useState } from 'react'
import css from './NoteForm.module.css'
import Button from '../Button/Button'
import { useQueryClient } from '@tanstack/react-query'

import { useRouter } from 'next/navigation'
import { useNoteDraftStore } from '@/lib/store/noteStore'
import { NoteDraft, NoteTag } from '@/types/note'
import { createNote } from '@/lib/api/clientApi'

type Props = {
  onSuccess?: () => void
  onClose?: () => void
}

const NoteForm = ({ onSuccess, onClose }: Props) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { draft, setDraft, clearDraft } = useNoteDraftStore()
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = (values: NoteDraft) => {
    const newErrors: { [key: string]: string } = {}
    if (!values.title) newErrors.title = 'Title is required'
    if (!values.content) newErrors.content = 'Content is required'
    if (!Object.values(NoteTag).includes(values.tag)) {
      newErrors.tag = 'Invalid tag'
    }
    return newErrors
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target
    setDraft({ ...draft, [name]: value })
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (formData: FormData) => {
    const values: NoteDraft = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      tag: formData.get('tag') as NoteTag,
    }

    const validationErrors = validateForm(values)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      await createNote(values)
      await queryClient.invalidateQueries({ queryKey: ['notes'] })
      clearDraft()
      onSuccess?.()
      router.back()
    } catch (err) {
      console.error('Error creating note:', err)
      setErrors({ form: 'Failed to create note. Please try again.' })
    }
  }

  const handleCancel = () => {
    clearDraft()
    if (onClose) {
      onClose()
    } else {
      router.back()
    }
  }

  return (
    <form action={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={draft?.title}
          onChange={handleChange}
          className={css.input}
        />
        {errors.title && <div className={css.error}>{errors.title}</div>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          defaultValue={draft?.content}
          onChange={handleChange}
          className={css.textarea}
        />
        {errors.content && <div className={css.error}>{errors.content}</div>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          defaultValue={draft?.tag}
          onChange={handleChange}
          className={css.select}
        >
          <option value={NoteTag.Work}>Work</option>
          <option value={NoteTag.Personal}>Personal</option>
          <option value={NoteTag.Meeting}>Meeting</option>
          <option value={NoteTag.Shopping}>Shopping</option>
          <option value={NoteTag.Todo}>Todo</option>
        </select>
        {errors.tag && <div className={css.error}>{errors.tag}</div>}
      </div>

      {errors.form && <div className={css.error}>{errors.form}</div>}

      <div className={css.btnGroup}>
        <Button
          typeBtn="button"
          className={css.cancelButton}
          value="Cancel"
          onClick={handleCancel}
        />
        <Button typeBtn="submit" className={css.submitButton} value="Create" />
      </div>
    </form>
  )
}

export default NoteForm
