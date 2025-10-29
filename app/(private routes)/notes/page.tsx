import css from './NotesPage.module.css'
import { fetchNotesServer } from '@/lib/api/serverApi'

export default async function NotesRoutePage() {
  const data = await fetchNotesServer({
    page: 1,
    perPage: 12,
  })

  const notes = data?.notes ?? []
  const page = data?.page ?? 1
  const perPage = data?.perPage ?? 12
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / perPage))

  if (!notes.length) {
    return (
      <main className={css.mainContent}>
        <section className={css.notesSection}>
          <h1 className={css.pageTitle}>Notes</h1>
          <p className={css.emptyText}>No notes available.</p>
        </section>
        <div className={css.paginationWrapper}>
          <p className={css.paginationText}>Page {page} / {totalPages}</p>
        </div>
      </main>
    )
  }

  return (
    <main className={css.mainContent}>
      <section className={css.notesSection}>
        <h1 className={css.pageTitle}>Notes</h1>
        <ul className={css.notesList}>
          {notes.map((n) => (
            <li key={n.id} className={css.noteItem}>
              <a href={`/notes/${n.id}`} className={css.noteLink}>{n.title}</a>
            </li>
          ))}
        </ul>
      </section>
      <div className={css.paginationWrapper}>
        <p className={css.paginationText}>Page {page} / {totalPages}</p>
      </div>
    </main>
  )
}
