type Props = {
  children: React.ReactNode
  sidebar: React.ReactNode
}

const NotesLayout = ({ children }: Props) => {
  return <section>{children}</section>
}

export default NotesLayout
