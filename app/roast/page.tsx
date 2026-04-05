import { Suspense } from 'react'
import type { Metadata } from 'next'
import RoastClient from './RoastClient'

type Props = {
  searchParams: Promise<{ wallet?: string; score?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { wallet = '', score = '?' } = await searchParams
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const shortWallet = wallet ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}` : 'anon'
  const ogUrl = `${appUrl}/api/og?wallet=${encodeURIComponent(wallet)}&score=${encodeURIComponent(score)}`

  return {
    title: `${shortWallet} got roasted — ${score}/100 Degen Score | BagsRoast`,
    description: `This Solana wallet has a ${score}/100 Degen Score. Get your wallet roasted at BagsRoast.`,
    openGraph: {
      title: `BagsRoast — ${shortWallet}`,
      description: `Degen Score: ${score}/100 · Get your Solana wallet roasted`,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: `BagsRoast — ${shortWallet}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `BagsRoast — ${shortWallet} — ${score}/100`,
      description: `Degen Score: ${score}/100. Get your wallet roasted.`,
      images: [ogUrl],
    },
  }
}

export default function RoastPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-600/8 blur-[100px]" />
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-red-900/10 blur-3xl" />
      </div>
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-4">
            <div className="text-5xl animate-bounce">🔥</div>
            <p className="text-orange-400 font-bold">Loading...</p>
          </div>
        }
      >
        <RoastClient />
      </Suspense>
    </main>
  )
}
