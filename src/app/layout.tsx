import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'De Klaagtrein — Klachten over de Nederlandse trein',
  description: 'Meld klachten over de trein. Anoniem. Openbaar. Samen maken we zichtbaar wat beter moet.',
  openGraph: {
    title: 'De Klaagtrein',
    description: 'Klachten over de Nederlandse trein — anoniem en openbaar',
    locale: 'nl_NL',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  )
}
