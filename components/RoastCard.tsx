'use client'

type Props = {
  roast: string
  degenScore: number
  wallet: string
}

function scoreColor(score: number) {
  if (score >= 80) return { text: 'text-emerald-400', glow: 'shadow-emerald-500/30', bar: 'from-emerald-500 to-green-400', ring: 'ring-emerald-500/20' }
  if (score >= 50) return { text: 'text-orange-400', glow: 'shadow-orange-500/30', bar: 'from-orange-500 to-amber-400', ring: 'ring-orange-500/20' }
  return { text: 'text-red-400', glow: 'shadow-red-500/30', bar: 'from-red-600 to-orange-500', ring: 'ring-red-500/20' }
}

function scoreLabel(score: number) {
  if (score >= 90) return { label: 'Certified Degen', emoji: '👑' }
  if (score >= 70) return { label: 'Mid Degen', emoji: '🎰' }
  if (score >= 50) return { label: 'Casual Gambler', emoji: '🎲' }
  if (score >= 30) return { label: 'Paper Hands', emoji: '🧻' }
  return { label: 'NGMI', emoji: '💀' }
}

export default function RoastCard({ roast, degenScore, wallet }: Props) {
  const colors = scoreColor(degenScore)
  const { label, emoji } = scoreLabel(degenScore)
  const short = `${wallet.slice(0, 6)}...${wallet.slice(-4)}`

  return (
    <div className="relative w-full max-w-2xl">
      {/* Outer glow ring */}
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-600/20 via-transparent to-red-900/10 blur-xl`} />

      {/* Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black shadow-2xl">

        {/* Top fire streak */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/80 to-transparent" />

        {/* Ambient glow inside */}
        <div className="pointer-events-none absolute -top-20 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-orange-600/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 rounded-full bg-red-800/10 blur-2xl" />

        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-base ring-1 ring-orange-500/20">
              🔥
            </div>
            <span className="font-mono text-xs text-zinc-500 tracking-wide">{short}</span>
          </div>

          {/* Degen Score badge */}
          <div className={`flex items-center gap-2 rounded-xl bg-zinc-800/60 px-3 py-1.5 ring-1 ${colors.ring}`}>
            <span className="text-sm">{emoji}</span>
            <div>
              <div className={`text-xs font-bold uppercase tracking-widest ${colors.text}`}>{label}</div>
            </div>
          </div>
        </div>

        {/* Score meter */}
        <div className="px-6 pt-5 pb-1">
          <div className="flex items-end justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-600">Degen Score</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-5xl font-black leading-none ${colors.text}`}>{degenScore}</span>
              <span className="text-lg font-bold text-zinc-600">/100</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${colors.bar} transition-all duration-700`}
              style={{ width: `${degenScore}%` }}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 my-5 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        {/* Roast text */}
        <div className="px-6 pb-6">
          <p className="relative z-10 text-base leading-8 text-zinc-300 md:text-[17px]">
            {roast}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/5 px-6 py-3">
          <span className="text-xs font-mono text-zinc-700">bagsroast.fm</span>
          <span className="flex items-center gap-1.5 text-xs text-zinc-600">
            Built on{' '}
            <a
              href="https://bags.fm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-orange-600 hover:text-orange-400 transition-colors"
            >
              Bags.fm
            </a>
          </span>
        </div>

        {/* Bottom fire streak */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-900/60 to-transparent" />
      </div>
    </div>
  )
}
