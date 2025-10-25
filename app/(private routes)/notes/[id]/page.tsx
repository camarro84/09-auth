import NoteModal from '@/app/@modal/(.)notes/[id]/page'
import { fetchNoteById } from '@/lib/api/clientApi'

import { Metadata } from 'next'

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params // ⚡ просто деструктуруємо
  const note = await fetchNoteById(id) // ⚡ передаємо рядок, а не об’єкт

  return {
    title: `Note ${note.title}`,
    description: note.content.slice(0, 30),
    openGraph: {
      title: `Note ${note.title}`,
      description: note.content.slice(0, 30),
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
      type: 'article',
    },
  }
}

export default function NotesPage({ params }: Props) {
  return <NoteModal params={params} />
}
