import type { Metadata } from 'next'
import Header from '@/components/Header/Header'
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider'
import AuthProvider from '@/components/AuthProvider/AuthProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'NoteHub',
  description: 'Notes app',
}

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            {children}
            {modal}
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  )
}
