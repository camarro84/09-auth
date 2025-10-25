import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider'
import AuthProvider from '@/components/AuthProvider/AuthProvider'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  title: 'NoteHub',
  description: 'Note application',
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
      <body className={roboto.variable} suppressHydrationWarning>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            {children}
            {modal}
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  )
}
