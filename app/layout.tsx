import type { Metadata } from 'next'
import { Pacifico } from 'next/font/google'
import './globals.css'

const pacifico = Pacifico({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-pacifico',
})

export const metadata: Metadata = {
  title: 'Bean There, Ran That',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={pacifico.variable}>{children}</body>
    </html>
  )
}
