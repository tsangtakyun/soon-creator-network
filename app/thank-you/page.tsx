import Link from 'next/link'

import ThankYouClient from '@/app/thank-you/client'

const pageStyle = {
  minHeight: '100vh',
  padding: '40px 24px 100px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#f7f8fb',
} as const

const cardStyle = {
  width: 'min(760px, 100%)',
  position: 'relative',
  overflow: 'hidden',
  padding: '36px',
  borderRadius: '32px',
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'linear-gradient(180deg, rgba(13,15,21,0.92), rgba(7,8,12,0.94))',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 28px 80px rgba(0,0,0,0.36)',
} as const

const primaryButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '54px',
  padding: '0 20px',
  borderRadius: '999px',
  border: '1px solid rgba(142,180,255,0.24)',
  background: 'linear-gradient(135deg, #1c72ff, #3d8bff)',
  color: '#ffffff',
  textDecoration: 'none',
  fontSize: '14px',
  boxShadow: '0 0 0 1px rgba(142,180,255,0.16), 0 0 28px rgba(27,114,255,0.32)',
} as const

const secondaryButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '54px',
  padding: '0 20px',
  borderRadius: '999px',
  border: '1px solid rgba(255,255,255,0.14)',
  background: 'rgba(255,255,255,0.05)',
  color: '#f4f7ff',
  textDecoration: 'none',
  fontSize: '14px',
} as const

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; payment?: string; plan?: string; session_id?: string }>
}) {
  const params = await searchParams

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <div style={{ fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(162,178,214,0.8)', marginBottom: '10px' }}>
          已收到申請
        </div>
        <h1
          style={{
            margin: '0 0 14px',
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
            lineHeight: 0.96,
            letterSpacing: '-0.07em',
            fontWeight: 350,
          }}
        >
          已收到你的 SOON Creator 申請
        </h1>
        <p
          style={{
            margin: '0 0 18px',
            fontSize: '18px',
            lineHeight: 1.8,
            color: 'rgba(210,217,234,0.8)',
          }}
        >
          系統已記錄你的創作者申請資料。下一步 SOON 會先建立第一輪創作者分析，再進入內部審核與後續配對流程。
        </p>

        <ThankYouClient
          applicationId={params.id}
          payment={params.payment}
          plan={params.plan}
          sessionId={params.session_id}
        />

        {params.id ? (
          <div
            style={{
              margin: '0 0 18px',
              padding: '14px 16px',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              lineHeight: 1.7,
              color: 'rgba(216,221,235,0.78)',
            }}
          >
            申請編號：<span style={{ color: '#f7f8fb' }}>{params.id}</span>
          </div>
        ) : null}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <Link href="/" style={primaryButtonStyle}>
            返回首頁
          </Link>
          <Link href="/creator-workspace" style={secondaryButtonStyle}>
            前往工作台
          </Link>
          <Link href="/apply" style={secondaryButtonStyle}>
            返回申請頁
          </Link>
        </div>
      </section>
    </main>
  )
}
