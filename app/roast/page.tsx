'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import RoastCard from '@/components/RoastCard'
import ShareButton from '@/components/ShareButton'

type RoastData = {
  roast: string
  degenScore: number
  context: Record<string, unknown>
}

function RoastContent() {
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
        if (d.error) setError(d.error)
        else setData(d)
      })
      .catch(() => setError('Something went wrong. Try again.'))
      .finally(() => setLoading(false))
  }, [wallet, router])

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="text-6xl animate-bounce">🔥</div>
        <p className="text-xl font-bold text-orange-400">Reading your shame...</p>
        <p className="text-sm text-zinc-500">Analyzing {wallet.slice(0, 8)}...{wallet.slice(-6)}</p>
        <div className="mt-4 flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-orange-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="text-5xl">💀</div>
        <p className="text-lg font-semibold text-red-400">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="rounded-full border border-zinc-700 px-6 py-2 text-sm text-zinc-400 hover:text-white"
        >
          Go back
        </button>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-6">
      <div className="flex w-full flex-col items-center gap-2 text-center">
        <span className="text-4xl">🔥</span>
        <h1 className="text-3xl font-black text-white">Your Wallet Got Roasted</h1>
        <p className="text-sm text-zinc-500">
          {wallet.slice(0, 8)}...{wallet.slice(-8)}
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
        className="text-sm text-zinc-600 hover:text-zinc-400"
      >
        Roast another wallet
      </button>
    </div>
  )
}

export default function RoastPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-20">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-600/10 blur-3xl" />
      </div>
      <Suspense fallback={
        <div className="flex flex-col items-center gap-4">
          <div className="text-5xl animate-bounce">🔥</div>
          <p className="text-orange-400">Loading...</p>
        </div>
      }>
        <RoastContent />
      </Suspense>
    </main>
  )
}
