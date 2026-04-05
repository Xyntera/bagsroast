'use client'

type Props = {
  roast: string
  degenScore: number
  wallet: string
}

function scoreColor(score: number) {
  if (score >= 80) return 'text-green-400'
  if (score >= 50) return 'text-orange-400'
  return 'text-red-500'
}

function scoreLabel(score: number) {
  if (score >= 90) return 'Certified Degen'
  if (score >= 70) return 'Mid Degen'
  if (score >= 50) return 'Casual Gambler'
  if (score >= 30) return 'Paper-Handed Normie'
  return 'NGMI'
}

export default function RoastCard({ roast, degenScore, wallet }: Props) {
  return (
    <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl shadow-orange-900/20">
      {/* Glow accent */}
      <div className="pointer-events-none absolute -top-10 left-1/2 h-40 w-60 -translate-x-1/2 rounded-full bg-orange-600/20 blur-3xl" />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <span className="font-mono text-sm text-zinc-500">{wallet}</span>
        </div>
        <div className="text-right">
          <div className={`text-4xl font-black ${scoreColor(degenScore)}`}>
            {degenScore}
            <span className="text-xl">/100</span>
          </div>
          <div className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            {scoreLabel(degenScore)}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mb-6 h-px bg-gradient-to-r from-transparent via-orange-800/50 to-transparent" />

      {/* Roast text */}
      <p className="relative z-10 text-base leading-7 text-zinc-200 md:text-lg">
        {roast}
      </p>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between text-xs text-zinc-600">
        <span>bagsroast.fm</span>
        <span className="flex items-center gap-1">
          Built on{' '}
          <a
            href="https://bags.fm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-700 hover:text-orange-500"
          >
            Bags.fm
          </a>
        </span>
      </div>
    </div>
  )
}
