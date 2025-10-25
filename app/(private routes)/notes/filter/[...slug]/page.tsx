import { GetNotesParams } from '@/lib/api/api'
import Notes from './Notes.client'
import { Metadata } from 'next'

const allowed = ['Work', 'Personal', 'Meeting', 'Shopping', 'Todo'] as const
type AllowedTag = (typeof allowed)[number]

type Props = {
  params: Promise<{ slug?: string[] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const raw = slug?.[0]
  const tag: GetNotesParams['tag'] =
    raw && (allowed as readonly string[]).includes(raw)
      ? (raw as AllowedTag)
      : undefined
  return {
    title: `Notes ${tag}`,
    description: `Select notes for ${tag}`,
    openGraph: {
      title: `Notes ${tag}`,
      description: '',
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `Notes for ${tag}`,
        },
      ],
      type: 'article',
    },
  }
}

export default async function NotesPage({ params }: Props) {
  const { slug } = await params
  const raw = slug?.[0]

  const tag: GetNotesParams['tag'] =
    raw && (allowed as readonly string[]).includes(raw)
      ? (raw as AllowedTag)
      : undefined

  return <Notes tag={tag} />
}
