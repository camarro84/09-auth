'use client'

import Modal from '@/components/Modal/Modal'
import NotePreview from '@/components/NotePreview/NotePreview'
import { Note } from '@/types/note'
import { useRouter } from 'next/navigation'

type Props = {
  data: Note
}

const NotePreviewDetails = ({ data }: Props) => {
  const router = useRouter()

  const handleClose = () => {
    router.back()
  }

  return (
    <Modal onClose={handleClose}>
      <NotePreview data={data} onClose={handleClose} />
    </Modal>
  )
}

export default NotePreviewDetails
