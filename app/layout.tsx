import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Geist, Geist_Mono } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { ClientProviders } from './client-providers'
import { fontsMap } from './fonts/fonts'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin-ext'],
  fallback: ['monospace'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | ee-stats',
    default: 'ee-stats',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${Object.values(fontsMap)
          .map((font) => font.variable)
          .join(' ')} font-mono`}
      >
        <NuqsAdapter>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ClientProviders>{children}</ClientProviders>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  )
}
