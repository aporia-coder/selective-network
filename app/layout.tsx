import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { cn } from '@/lib/utils'
import { ModalProvider } from '@/components/providers/ModalProvider'
// import { SocketProvider } from '@/components/providers/SocketProvider'
import QueryProvider from '@/components/providers/QueryProvider'

const openSans = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Selective Network',
  description: 'Create your own Social Media server',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(openSans.className, 'bg-white dark:bg-[#313338]')}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="discord-theme"
          >
            {/* <SocketProvider> */}
            <ModalProvider />
            <QueryProvider>{children}</QueryProvider>
            {/* </SocketProvider> */}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
