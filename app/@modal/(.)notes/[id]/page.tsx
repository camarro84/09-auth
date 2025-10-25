import { fetchNoteById } from '@/lib/api/clientApi'
import NotePreviewDetails from './NotePreview.client'

type Props = {
  params: { id: string }
}

export default async function NoteModal({ params }: Props) {
  // ⚡ Передаємо тільки рядок, як очікує fetchNoteById
  const data = await fetchNoteById(params.id)

  return <NotePreviewDetails data={data} />
}
