import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GREIA - Life\'s Operating System',
  description: 'Your home worldwide',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}