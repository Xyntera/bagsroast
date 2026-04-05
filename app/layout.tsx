import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Providers from '@/components/providers'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BagsRoast — AI roasts your Solana wallet',
  description: 'Paste your wallet. AI clowns your entire trading history. Share it. Everyone laughs.',
  openGraph: {
    title: 'BagsRoast — AI roasts your Solana wallet',
    description: 'Paste your wallet. AI clowns your entire trading history.',
    images: ['/api/og'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BagsRoast — AI roasts your Solana wallet',
    description: 'Paste your wallet. AI clowns your entire trading history.',
    images: ['/api/og'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-black text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
