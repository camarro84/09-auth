import LayoutNotes from '@/components/LayoutNotes/LayoutNotes'
import SidebarNotes from '@/components/SidebarNotes/SidebarNotes'

type Props = {
  children: React.ReactNode
  sidebar: React.ReactNode
}

export default function NotesFilterLayout({ children, sidebar }: Props) {
  return <LayoutNotes sidebar={<SidebarNotes />}>{children}</LayoutNotes>
}
