'use client'

type Props = {
  roast: string
  degenScore: number
  wallet: string
}

export default function ShareButton({ roast, degenScore, wallet }: Props) {
  function handleShare() {
    const short = roast.slice(0, 200).trim()
    const text = `My Solana wallet got roasted by AI and I got ${degenScore}/100 Degen Score 🔥\n\n"${short}..."\n\nRoast yours at`
    const url = `${window.location.origin}/roast?wallet=${wallet}`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, '_blank', 'noopener,noreferrer')
  }

  function handleCopy() {
    const url = `${window.location.origin}/roast?wallet=${wallet}`
    navigator.clipboard.writeText(url).catch(() => {})
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-6 py-3 font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]"
      >
        Share on X 𝕏
      </button>
      <button
        onClick={handleCopy}
        className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-400 transition-all hover:border-zinc-500 hover:text-white"
      >
        Copy Link
      </button>
    </div>
  )
}
