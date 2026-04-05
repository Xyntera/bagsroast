import { NextRequest } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    'X-Title': 'BagsRoast',
  },
})

export async function POST(req: NextRequest) {
  const { wallet } = await req.json()

  if (!wallet || typeof wallet !== 'string' || wallet.length < 32) {
    return Response.json({ error: 'Invalid wallet address.' }, { status: 400 })
  }

  try {
    const [txData, balanceData, bagsData] = await Promise.allSettled([
      fetchHeliusTransactions(wallet),
      fetchSolBalance(wallet),
      fetchBagsCreatorData(wallet),
    ])

    const transactions = txData.status === 'fulfilled' ? txData.value : []
    const solBalance = balanceData.status === 'fulfilled' ? balanceData.value : 0
    const isBagsCreator = bagsData.status === 'fulfilled' ? bagsData.value : false

    console.log(`[roast] wallet=${wallet.slice(0,8)} txns=${transactions.length} sol=${solBalance}`)

    const context = buildWalletContext(wallet, transactions, solBalance, isBagsCreator)
    const { roast, degenScore } = await generateRoast(context, wallet)

    return Response.json({ roast, degenScore, context })
  } catch (err: any) {
    const msg: string = err?.message ?? String(err)
    console.error('[roast] error:', msg)

    if (msg.includes('429') || msg.toLowerCase().includes('rate')) {
      return Response.json(
        { error: 'AI is rate-limited. Wait 30 seconds and try again.' },
        { status: 429 }
      )
    }
    // Return actual error in dev so we can debug
    return Response.json(
      { error: `Failed to generate roast: ${msg.slice(0, 200)}` },
      { status: 500 }
    )
  }
}

async function fetchHeliusTransactions(wallet: string) {
  const url = `https://api.helius.xyz/v0/addresses/${wallet}/transactions?api-key=${process.env.HELIUS_API_KEY}&limit=50`
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
  if (!res.ok) {
    console.warn('[helius] non-ok:', res.status)
    return []
  }
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

async function fetchSolBalance(wallet: string): Promise<number> {
  const res = await fetch(process.env.HELIUS_RPC_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getBalance', params: [wallet] }),
    signal: AbortSignal.timeout(8000),
  })
  const data = await res.json()
  return (data?.result?.value ?? 0) / 1e9
}

async function fetchBagsCreatorData(wallet: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${process.env.BAGS_API_BASE}/token-launch/creator/v3?wallet=${wallet}`,
      { headers: { 'x-api-key': process.env.BAGS_API_KEY! }, signal: AbortSignal.timeout(8000) }
    )
    if (!res.ok) return false
    const data = await res.json()
    return data?.success && Array.isArray(data?.response) && data.response.length > 0
  } catch {
    return false
  }
}

function buildWalletContext(
  wallet: string,
  transactions: any[],
  solBalance: number,
  isBagsCreator: boolean
) {
  const txTypes: Record<string, number> = {}
  const tokenCounts: Record<string, number> = {}
  let totalSent = 0
  let totalReceived = 0

  for (const tx of transactions) {
    txTypes[tx.type] = (txTypes[tx.type] ?? 0) + 1
    for (const t of tx.tokenTransfers ?? []) {
      const mint: string = t.mint ?? 'unknown'
      tokenCounts[mint] = (tokenCounts[mint] ?? 0) + 1
    }
    for (const t of tx.nativeTransfers ?? []) {
      if (t.fromUserAccount === wallet) totalSent += t.amount / 1e9
      if (t.toUserAccount === wallet) totalReceived += t.amount / 1e9
    }
  }

  const topTokens = Object.entries(tokenCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([mint, count]) => `${mint.slice(0, 8)}... (${count}x)`)

  return {
    walletShort: `${wallet.slice(0, 6)}...${wallet.slice(-4)}`,
    solBalance: solBalance.toFixed(3),
    totalTx: transactions.length,
    totalSwaps: txTypes['SWAP'] ?? 0,
    topTokens,
    netSolFlow: (totalReceived - totalSent).toFixed(3),
    isBagsCreator,
    txBreakdown: Object.entries(txTypes).map(([k, v]) => `${k}:${v}`).join(', '),
  }
}

async function generateRoast(
  ctx: ReturnType<typeof buildWalletContext>,
  wallet: string
) {
  const prompt = `You are a brutally honest, dry-humor friend who just read someone's entire Solana transaction history. Deliver a verdict — not a performance. No theatrics, no bullet points, no list-style stat recaps.

Wallet: ${ctx.walletShort}
SOL Balance: ${ctx.solBalance} SOL
Total transactions: ${ctx.totalTx}
Swaps: ${ctx.totalSwaps}
Most traded tokens: ${ctx.topTokens.join(', ') || 'nothing — pure SOL churn'}
Net SOL flow: ${ctx.netSolFlow} SOL (negative = net loss)
Transaction breakdown: ${ctx.txBreakdown || 'unknown'}
Bags.fm creator: ${ctx.isBagsCreator ? 'YES' : 'NO'}

Context clues:
- WSOL / So1111... in top tokens = swapping SOL for wrapped SOL and back — zero productive output
- CLOSE_ACCOUNT transactions = closing empty token accounts after rugs
- Negative net SOL flow = real money gone, not paper loss
- No Bags.fm = missed one of the few Solana protocols that actually pays creators
- Bags.fm creator = acknowledge it as the one competent move in an otherwise grim record

Rules:
- Open immediately with the most damning number — no "Congrats on", no "Ladies and gentlemen", no theatrical opener
- 130-160 words, tight flowing prose, not a stat recitation
- Shorten any token addresses to 6 chars max
- End with one cold, original line that lands like a verdict — no clichés
- The very last line must be exactly: DEGEN_SCORE: <number 0-100>`

  const completion = await openai.chat.completions.create({
    model: 'qwen/qwen3.6-plus:free',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 2000, // Qwen thinking model burns tokens on reasoning — needs headroom
  })

  const raw = completion.choices[0]?.message?.content ?? ''
  console.log('[roast] raw response length:', raw.length)

  if (!raw) {
    // Fallback if model returns empty
    return fallbackRoast(ctx)
  }

  const scoreMatch = raw.match(/DEGEN_SCORE:\s*(\d+)/i)
  const degenScore = scoreMatch ? Math.min(100, Math.max(0, parseInt(scoreMatch[1]))) : 42
  const roast = raw.replace(/DEGEN_SCORE:\s*\d+/gi, '').trim()

  return { roast: roast || fallbackRoast(ctx).roast, degenScore }
}

function fallbackRoast(ctx: ReturnType<typeof buildWalletContext>) {
  return {
    roast: `Look at ${ctx.walletShort} over here with ${ctx.solBalance} SOL and ${ctx.totalTx} transactions of pure, uncut financial self-harm. ${ctx.totalSwaps} swaps and somehow still holding bags heavier than their life decisions. The net SOL flow of ${ctx.netSolFlow} SOL tells the whole story — in, out, and mostly gone. ${ctx.isBagsCreator ? 'At least they launched on Bags.fm — the one competent decision in this entire disaster.' : "Didn't even launch on Bags.fm — which is wild because even that would've been a smarter move than whatever this is."} Somewhere out there, a financial advisor is crying and they don't even know why. WAGMI? Nah fam. Not this wallet.`,
    degenScore: Math.min(99, Math.max(10, ctx.totalTx)),
  }
}
