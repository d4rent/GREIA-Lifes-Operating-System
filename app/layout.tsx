import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// UI Components
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

// Fonts
const inter = Inter({ subsets: ['latin'] })

// Metadata
export const metadata: Metadata = {
  title: 'GREIA - Global Property & Services Platform',
  description: 'Your global property and services marketplace. Connecting people with their perfect homes and trusted professionals worldwide.',
  keywords: 'property, real estate, services, marketplace, global, homes, professionals',
  authors: [{ name: 'GREIA' }],
  creator: 'GREIA',
  publisher: 'GREIA',
  robots: 'index, follow',
  themeColor: '#00A9B5',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}