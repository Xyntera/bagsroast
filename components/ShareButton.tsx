'use client'

import { useState } from 'react'

type Props = {
  roast: string
  degenScore: number
  wallet: string
}

export default function ShareButton({ roast, degenScore, wallet }: Props) {
  const [copied, setCopied] = useState(false)

  function handleShare() {
    const short = roast.slice(0, 180).trim()
    const text = `I got a ${degenScore}/100 Degen Score on BagsRoast 🔥\n\n"${short}..."\n\nRoast your wallet:`
    const url = `${window.location.origin}/roast?wallet=${wallet}`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, '_blank', 'noopener,noreferrer')
  }

  function handleCopy() {
    const url = `${window.location.origin}/roast?wallet=${wallet}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }

  return (
    <div className="flex gap-3 w-full max-w-2xl">
      <button
        onClick={handleShare}
        className="flex flex-1 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-orange-600/25 transition-all hover:scale-[1.02] hover:shadow-orange-600/40 active:scale-[0.98]"
      >
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        Share on X
      </button>
      <button
        onClick={handleCopy}
        className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-medium text-zinc-400 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-[0.98]"
      >
        {copied ? (
          <>
            <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-emerald-400">Copied!</span>
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Link
          </>
        )}
      </button>
    </div>
  )
}
