import { Metadata } from 'next'
import CreateNote from './CreateNote.client'

import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Create new note',
    description: 'Add a new note to your collection',
    openGraph: {
      title: 'Create new note',
      description: 'Add a new note to your collection',
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `Notes for logo`,
        },
      ],
      type: 'article',
    },
  }
}

export default function CreateNotePage() {
  return (
    <div>
      <CreateNote />
    </div>
  )
}
