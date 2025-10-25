import NoteDetailsClient from './NoteDetails.client'

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function NotePage({ params }: Props) {
  const awaited = await params

  return (
    <main>
      <NoteDetailsClient params={awaited} />
    </main>
  )
}
