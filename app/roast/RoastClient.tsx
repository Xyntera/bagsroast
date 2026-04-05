'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import RoastCard from '@/components/RoastCard'
import ShareButton from '@/components/ShareButton'

type RoastData = {
  roast: string
  degenScore: number
  context: Record<string, unknown>
}

export default function RoastClient() {
  const params = useSearchParams()
  const router = useRouter()
  const wallet = params.get('wallet') ?? ''

  const [data, setData] = useState<RoastData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!wallet) {
      router.replace('/')
      return
    }

    fetch('/api/roast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          setError(d.error)
        } else {
          setData(d)
          // Update URL with score so OG meta tags work when shared
          window.history.replaceState(
            null,
            '',
            `/roast?wallet=${wallet}&score=${d.degenScore}`
          )
        }
      })
      .catch(() => setError('Something went wrong. Try again.'))
      .finally(() => setLoading(false))
  }, [wallet, router])

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-2xl animate-pulse" />
          <div className="relative text-7xl animate-bounce">🔥</div>
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-black text-white">Analyzing your shame...</p>
          <p className="text-sm text-zinc-500 font-mono">
            {wallet.slice(0, 8)}...{wallet.slice(-6)}
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-zinc-600 w-64">
          {['Fetching transactions', 'Calculating losses', 'Drafting roast'].map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div
                className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"
                style={{ animationDelay: `${i * 0.4}s` }}
              />
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        <div className="text-6xl">💀</div>
        <div className="space-y-2">
          <p className="text-xl font-black text-white">Roast Failed</p>
          <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-xl px-4 py-3">
            {error}
          </p>
        </div>
        <button
          onClick={() => router.push('/')}
          className="rounded-2xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:border-white/20 transition-all"
        >
          ← Try again
        </button>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-2xl ring-1 ring-orange-500/20">
          🔥
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
          Your Wallet Got Roasted
        </h1>
        <p className="font-mono text-xs text-zinc-600">
          {wallet.slice(0, 6)}...{wallet.slice(-6)}
        </p>
      </div>

      <RoastCard
        roast={data.roast}
        degenScore={data.degenScore}
        wallet={wallet}
      />

      <ShareButton
        roast={data.roast}
        degenScore={data.degenScore}
        wallet={wallet}
      />

      <button
        onClick={() => router.push('/')}
        className="text-xs text-zinc-700 hover:text-zinc-400 transition-colors"
      >
        Roast another wallet →
      </button>
    </div>
  )
}
