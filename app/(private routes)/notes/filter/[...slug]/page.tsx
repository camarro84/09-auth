import Notes from './Notes.client'

const allowed = ['Work', 'Personal', 'Meeting', 'Shopping', 'Todo'] as const
type AllowedTag = (typeof allowed)[number]

type Props = {
  params: Promise<{
    slug?: string[]
  }>
}

export default async function NotesPage({ params }: Props) {
  const { slug } = await params
  const raw = slug?.[0]

  const tag: AllowedTag | undefined = allowed.includes(raw as AllowedTag)
    ? (raw as AllowedTag)
    : undefined

  return <Notes tag={tag} />
}
