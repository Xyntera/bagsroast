# BagsRoast

**Get your Solana wallet brutally roasted by AI.**

BagsRoast analyzes your onchain trading history and generates a savage, personalized roast — complete with a Degen Score from 0–100. Built for the [Bags.fm Hackathon](https://bags.fm/hackathon).

---

## What It Does

1. Enter or connect your Solana wallet
2. The app fetches your last 50 transactions via Helius
3. AI (Qwen via OpenRouter) writes a brutal 150-word roast based on your actual onchain behavior
4. Share your roast card on Twitter

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Wallet | Privy (Solana-only) |
| Onchain Data | Helius Enhanced API |
| AI Roast | OpenRouter — `qwen/qwen3.6-plus:free` |
| Bags Integration | Bags.fm Public API v2 |
| OG Images | `next/og` |

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/Xyntera/bagsroast
cd bagsroast
npm install
```

### 2. Set up environment variables

Create `.env.local` in the project root:

- **.ENV**: [.env](https://github.com/Xyntera/bagsroast/blob/main/.env.local.example)

```env
HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
HELIUS_API_KEY=YOUR_KEY
OPENROUTER_API_KEY=sk-or-v1-YOUR_KEY
NEXT_PUBLIC_PRIVY_APP_ID=YOUR_PRIVY_APP_ID
PRIVY_APP_SECRET=YOUR_PRIVY_SECRET
BAGS_API_BASE=https://public-api-v2.bags.fm/api/v1
BAGS_API_KEY=YOUR_BAGS_KEY
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Get your keys:
- **Helius**: [helius.dev](https://helius.dev)
- **OpenRouter**: [openrouter.ai/keys](https://openrouter.ai/keys)
- **Privy**: [privy.io](https://privy.io)
- **Bags API**: [bags.fm](https://bags.fm)

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
app/
  page.tsx              # Landing page + wallet connect
  roast/page.tsx        # Roast result display
  api/roast/route.ts    # Core: Helius fetch + AI roast generation
  api/og/route.tsx      # OG image for Twitter sharing
components/
  providers.tsx         # Privy wallet provider
  RoastCard.tsx         # Roast text + Degen Score UI
  ShareButton.tsx       # Twitter share button
```

---

## API Routes

### `POST /api/roast`

**Body:** `{ wallet: string }`

**Response:**
```json
{
  "roast": "Look at 21wG4F...",
  "degenScore": 74,
  "context": {
    "solBalance": "1.234",
    "totalTx": 50,
    "totalSwaps": 23
  }
}
```

Fetches Helius transaction history + SOL balance + Bags creator status in parallel, builds wallet context, then calls OpenRouter to generate the roast.

### `GET /api/og?wallet=...&score=...`

Returns a 1200×630 PNG OG image for Twitter card previews.

---

## Bags.fm Integration

- Checks if the wallet is a Bags.fm token creator via the Bags API
- Bags creators get acknowledged in the roast ("one smart move at least")
- Built and submitted as part of the Bags Hackathon

---

## Deploying to Vercel

1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → import the repo
3. Add all 8 environment variables from `.env.local`
4. Deploy
5. Update `NEXT_PUBLIC_APP_URL` to your Vercel URL → redeploy

---

## License

MIT
