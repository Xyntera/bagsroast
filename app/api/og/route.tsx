import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

function scoreLabel(score: number) {
  if (score >= 90) return 'CERTIFIED DEGEN'
  if (score >= 70) return 'MID DEGEN'
  if (score >= 50) return 'CASUAL GAMBLER'
  if (score >= 30) return 'PAPER HANDS'
  return 'NGMI'
}

function scoreColor(score: number) {
  if (score >= 80) return '#34d399'
  if (score >= 50) return '#fb923c'
  return '#f87171'
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const score = parseInt(searchParams.get('score') ?? '0', 10)
  const wallet = searchParams.get('wallet') ?? 'anon'
  const shortWallet =
    wallet.length > 12 ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}` : wallet

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const color = scoreColor(score)
  const label = scoreLabel(score)

  // Fetch icon from public/
  let iconSrc: string | null = null
  try {
    const iconRes = await fetch(`${appUrl}/icon.png`)
    if (iconRes.ok) {
      const buf = await iconRes.arrayBuffer()
      const b64 = Buffer.from(buf).toString('base64')
      iconSrc = `data:image/png;base64,${b64}`
    }
  } catch {
    // fall back to no icon
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: '#080808',
          width: '100%',
          height: '100%',
          display: 'flex',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Orange glow - left */}
        <div
          style={{
            position: 'absolute',
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: 'rgba(234,88,12,0.18)',
            filter: 'blur(100px)',
            top: -100,
            left: -80,
          }}
        />
        {/* Red glow - bottom right */}
        <div
          style={{
            position: 'absolute',
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'rgba(153,27,27,0.15)',
            filter: 'blur(80px)',
            bottom: -60,
            right: 200,
          }}
        />

        {/* Left column — content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '52px 0 48px 64px',
            width: 680,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Top: Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: 3,
                textTransform: 'uppercase',
              }}
            >
              BAGS
              <span style={{ color: '#f97316' }}>ROAST</span>
            </div>
            <div
              style={{
                fontSize: 13,
                color: '#52525b',
                marginLeft: 8,
                letterSpacing: 1,
              }}
            >
              · bagsroast.fm
            </div>
          </div>

          {/* Middle: Score */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div
              style={{
                fontSize: 16,
                color: '#71717a',
                fontWeight: 600,
                letterSpacing: 4,
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              Degen Score
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span
                style={{
                  fontSize: 140,
                  fontWeight: 900,
                  color: color,
                  lineHeight: 1,
                  letterSpacing: -4,
                }}
              >
                {score}
              </span>
              <span style={{ fontSize: 36, color: '#52525b', fontWeight: 700 }}>
                /100
              </span>
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: color,
                letterSpacing: 3,
                textTransform: 'uppercase',
                marginTop: 4,
              }}
            >
              {label}
            </div>
          </div>

          {/* Bottom: wallet + built on */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 40 }}>
            <div
              style={{
                fontSize: 15,
                color: '#3f3f46',
                fontFamily: 'monospace',
                letterSpacing: 1,
              }}
            >
              {shortWallet}
            </div>
            <div
              style={{
                fontSize: 14,
                color: '#3f3f46',
              }}
            >
              Built on{' '}
              <span style={{ color: '#c2410c' }}>Bags.fm</span>
            </div>
          </div>
        </div>

        {/* Right column — mascot */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {iconSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={iconSrc}
              width={320}
              height={320}
              style={{ objectFit: 'contain' }}
              alt=""
            />
          ) : (
            <div style={{ fontSize: 160 }}>🔥</div>
          )}
        </div>

        {/* Top edge line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background:
              'linear-gradient(90deg, transparent, #ea580c, transparent)',
          }}
        />
        {/* Bottom edge line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            background:
              'linear-gradient(90deg, transparent, #7c2d12, transparent)',
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
