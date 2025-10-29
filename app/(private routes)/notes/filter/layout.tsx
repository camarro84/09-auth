import LayoutNotes from '@/components/LayoutNotes/LayoutNotes'

type Props = {
  children: React.ReactNode
  sidebar: React.ReactNode
}

export default function NotesLayout({ children, sidebar }: Props) {
  return <LayoutNotes sidebar={sidebar}>{children}</LayoutNotes>
}
