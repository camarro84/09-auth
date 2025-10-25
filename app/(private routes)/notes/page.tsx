import css from './NotesPage.module.css'
import { fetchNotesServer } from '@/lib/api/serverApi'

export default async function NotesRoutePage() {
  const data = await fetchNotesServer({
    page: 1,
    perPage: 12,
  })

  if (!data || !data.notes || data.notes.length === 0) {
    return (
      <main className={css.mainContent}>
        <section className={css.notesSection}>
          <h1 className={css.pageTitle}>Notes</h1>
          <p className={css.emptyText}>No notes available.</p>
        </section>

        <div className={css.paginationWrapper}>
          <p className={css.paginationText}>Page 1 / 1</p>
        </div>
      </main>
    )
  }

  return (
    <main className={css.mainContent}>
      <section className={css.notesSection}>
        <h1 className={css.pageTitle}>Notes</h1>

        <ul className={css.notesGrid}>
          {data.notes.map((note) => (
            <li key={note.id} className={css.noteCard}>
              <h2 className={css.noteTitle}>{note.title}</h2>

              <p className={css.noteTag}>{note.tag}</p>

              <p className={css.noteContent}>{note.content}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className={css.paginationWrapper}>
        <p className={css.paginationText}>
          Page {data.page} / {data.totalPages}
        </p>
      </div>
    </main>
  )
}
