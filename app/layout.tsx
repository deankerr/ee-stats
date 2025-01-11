import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { ClientProviders } from './client-providers'
import './globals.css'
import { geistMono, geistSans } from './fonts/fonts'

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
      <body className={`${geistSans.variable} ${geistMono.variable} font-mono`}>
        <NuqsAdapter>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ClientProviders>{children}</ClientProviders>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  )
}
