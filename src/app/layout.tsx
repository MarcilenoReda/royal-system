import type { Metadata } from 'next'
import { IBM_Plex_Sans_Arabic } from 'next/font/google'
import './globals.css'
import AppLayout from '@/components/layout/AppLayout'

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  weight: ['400', '600', '700'],
  subsets: ['arabic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Royal System - إدارة ورش الصيانة',
  description: 'نظام إدارة ورش الصيانة',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className={ibmPlexSansArabic.className}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  )
}
