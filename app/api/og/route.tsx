import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const score = searchParams.get('score') ?? '??'
  const wallet = searchParams.get('wallet') ?? 'anon'

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a00 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Orange glow */}
        <div
          style={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(249,115,22,0.15)',
            filter: 'blur(80px)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
          }}
        />

        <div style={{ fontSize: 80 }}>🔥</div>

        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: 'white',
            letterSpacing: -2,
            marginTop: 16,
          }}
        >
          BAGS
          <span style={{ color: '#f97316' }}>ROAST</span>
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize: 36,
            color: '#f97316',
            fontWeight: 800,
          }}
        >
          Degen Score: {score}/100
        </div>

        <div
          style={{
            marginTop: 12,
            fontSize: 18,
            color: '#52525b',
          }}
        >
          {wallet.length > 20 ? `${wallet.slice(0, 8)}...${wallet.slice(-8)}` : wallet}
        </div>

        <div
          style={{
            marginTop: 32,
            fontSize: 16,
            color: '#3f3f46',
          }}
        >
          bagsroast.fm · Built on Bags.fm
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
