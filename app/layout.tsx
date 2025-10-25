import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider'
import AuthProvider from '@/components/AuthProvider/AuthProvider'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  title: 'NoteHub',
  description: 'NoteHub Auth HW-09',
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
