'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Home() {
  const { login, authenticated, user } = usePrivy()
  const router = useRouter()
  const [manualAddress, setManualAddress] = useState('')
  const [loading, setLoading] = useState(false)

  const walletAddress =
    user?.linkedAccounts?.find((a) => a.type === 'wallet')?.address ?? ''

  async function handleRoast(address: string) {
    if (!address) return
    setLoading(true)
    router.push(`/roast?wallet=${address}`)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
      {/* Glow background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-600/20 blur-3xl" />
      </div>

      <div className="relative z-10 flex max-w-xl flex-col items-center gap-6">
        <div className="text-6xl">🔥</div>

        <h1 className="text-5xl font-black tracking-tight text-white md:text-7xl">
          BAGS
          <span className="bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
            ROAST
          </span>
        </h1>

        <p className="text-lg text-zinc-400 md:text-xl">
          Connect your Solana wallet. AI reads your entire trading history and
          absolutely destroys you.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-500">
          <span className="rounded-full border border-zinc-800 px-3 py-1">💸 Paper hands exposed</span>
          <span className="rounded-full border border-zinc-800 px-3 py-1">🪤 Rugs catalogued</span>
          <span className="rounded-full border border-zinc-800 px-3 py-1">📉 Losses quantified</span>
        </div>

        {authenticated && walletAddress ? (
          <button
            onClick={() => handleRoast(walletAddress)}
            disabled={loading}
            className="mt-4 rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-10 py-4 text-lg font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] disabled:opacity-60"
          >
            {loading ? 'Roasting...' : 'Roast My Wallet 🔥'}
          </button>
        ) : (
          <button
            onClick={login}
            className="mt-4 rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-10 py-4 text-lg font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]"
          >
            Connect Wallet to Get Roasted
          </button>
        )}

        {/* Manual address fallback */}
        <div className="mt-2 flex w-full flex-col items-center gap-2">
          <p className="text-sm text-zinc-600">or paste any wallet address</p>
          <div className="flex w-full gap-2">
            <input
              type="text"
              placeholder="Solana wallet address..."
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-orange-500"
            />
            <button
              onClick={() => handleRoast(manualAddress)}
              disabled={!manualAddress || loading}
              className="rounded-xl bg-orange-500/20 px-5 py-3 text-sm font-semibold text-orange-400 transition-all hover:bg-orange-500/30 disabled:opacity-40"
            >
              Roast
            </button>
          </div>
        </div>

        <p className="mt-6 text-xs text-zinc-700">
          Built on{' '}
          <a
            href="https://bags.fm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 hover:text-orange-400"
          >
            Bags.fm
          </a>{' '}
          · Powered by Helius + OpenRouter · For the Bags Hackathon
        </p>
      </div>
    </main>
  )
}
