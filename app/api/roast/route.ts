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

  if (!wallet || typeof wallet !== 'string') {
    return Response.json({ error: 'Missing wallet address' }, { status: 400 })
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

    const context = buildWalletContext(wallet, transactions, solBalance, isBagsCreator)
    const { roast, degenScore } = await generateRoast(context)

    return Response.json({ roast, degenScore, context })
  } catch (err: any) {
    console.error('Roast error:', err)
    const msg = err?.message ?? ''
    if (msg.includes('429') || msg.includes('rate') || msg.includes('Rate')) {
      return Response.json(
        { error: 'AI model is rate-limited right now. Wait 30s and try again.' },
        { status: 429 }
      )
    }
    return Response.json({ error: 'Failed to generate roast. Try again.' }, { status: 500 })
  }
}

async function fetchHeliusTransactions(wallet: string) {
  // Fetch all tx types — SWAP filter misses many degen wallets
  const url = `https://api.helius.xyz/v0/addresses/${wallet}/transactions?api-key=${process.env.HELIUS_API_KEY}&limit=50`
  const res = await fetch(url)
  if (!res.ok) return []
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

async function fetchSolBalance(wallet: string): Promise<number> {
  const res = await fetch(process.env.HELIUS_RPC_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getBalance',
      params: [wallet],
    }),
  })
  const data = await res.json()
  return (data?.result?.value ?? 0) / 1e9
}

async function fetchBagsCreatorData(wallet: string): Promise<boolean> {
  const res = await fetch(
    `${process.env.BAGS_API_BASE}/token-launch/creator/v3?wallet=${wallet}`,
    { headers: { 'x-api-key': process.env.BAGS_API_KEY! } }
  )
  if (!res.ok) return false
  const data = await res.json()
  return data?.success && Array.isArray(data?.response) && data.response.length > 0
}

function buildWalletContext(
  wallet: string,
  transactions: any[],
  solBalance: number,
  isBagsCreator: boolean
) {
  const swaps = transactions.filter((tx: any) => tx.type === 'SWAP')
  const totalSwaps = swaps.length
  const txTypes = transactions.reduce((acc: Record<string, number>, tx: any) => {
    acc[tx.type] = (acc[tx.type] ?? 0) + 1
    return acc
  }, {})

  // Find tokens traded and rough P&L signals from all txns
  const tokenCounts: Record<string, number> = {}
  let totalBought = 0
  let totalSold = 0

  for (const tx of transactions) {
    for (const t of tx.tokenTransfers ?? []) {
      const mint = t.mint ?? 'unknown'
      tokenCounts[mint] = (tokenCounts[mint] ?? 0) + 1
    }
    for (const t of tx.nativeTransfers ?? []) {
      if (t.fromUserAccount === wallet) totalSold += t.amount / 1e9
      if (t.toUserAccount === wallet) totalBought += t.amount / 1e9
    }
  }

  const topTokens = Object.entries(tokenCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([mint, count]) => `${mint.slice(0, 6)}...${mint.slice(-4)} (${count} trades)`)

  const netPnl = totalBought - totalSold

  return {
    wallet: `${wallet.slice(0, 6)}...${wallet.slice(-4)}`,
    solBalance: solBalance.toFixed(3),
    totalSwaps,
    topTokens,
    netSolFlow: netPnl.toFixed(3),
    isBagsCreator,
    totalTx: transactions.length,
    txTypes: JSON.stringify(txTypes),
  }
}

async function generateRoast(context: ReturnType<typeof buildWalletContext>) {
  const prompt = `You are a brutally funny crypto roast comedian. You roast Solana wallets based on their onchain history. Be savage, specific, and funny. Reference the actual data. End with a "DEGEN SCORE" from 0-100 on its own line in this exact format: DEGEN_SCORE: <number>

Wallet data:
- Address: ${context.wallet}
- SOL Balance: ${context.solBalance} SOL
- Total transactions: ${context.totalTx}
- Total swaps analyzed: ${context.totalSwaps}
- Most traded tokens: ${context.topTokens.join(', ') || 'none found'}
- Net SOL flow from swaps: ${context.netSolFlow} SOL
- Is Bags.fm creator: ${context.isBagsCreator ? 'YES — at least they did ONE smart thing' : 'NO'}
- Transaction types breakdown: ${context.txTypes}

Write a roast of 150-200 words. Be ruthless but funny. No bullet points — flowing prose like a stand-up set.`

  const completion = await openai.chat.completions.create({
    model: 'qwen/qwen3.6-plus:free',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 500,
  })

  const text = completion.choices[0]?.message?.content ?? ''

  // Parse degen score
  const scoreMatch = text.match(/DEGEN_SCORE:\s*(\d+)/)
  const degenScore = scoreMatch ? Math.min(100, Math.max(0, parseInt(scoreMatch[1]))) : 42
  const roast = text.replace(/DEGEN_SCORE:\s*\d+/g, '').trim()

  return { roast, degenScore }
}
