import Link from 'next/link'

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const params = await searchParams

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f6f1e8 0%, #ece3d6 100%)', padding: '42px 24px 90px', fontFamily: 'Georgia, Times New Roman, serif', color: '#1a1a18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <section style={{ maxWidth: '760px', padding: '30px', borderRadius: '28px', background: 'rgba(255,255,255,0.78)', border: '1px solid rgba(26,26,24,0.10)' }}>
        <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '0.18em', color: '#8b7c69' }}>APPLICATION RECEIVED</p>
        <h1 style={{ margin: '0 0 12px', fontSize: '52px', lineHeight: 1.02, fontWeight: 500 }}>多謝你登記 SOON Creator Network</h1>
        <p style={{ margin: '0 0 18px', fontSize: '18px', lineHeight: 1.7, color: '#5b5348' }}>
          第一版 MVP 已經收到你嘅 creator 申請。之後 SOON 會用 AI 幫你做第一輪 creator analysis，再由 internal team review，將你放入未來 client campaign matching database。
        </p>
        {params.id ? (
          <div style={{ margin: '0 0 18px', padding: '14px 16px', borderRadius: '16px', background: '#fbf8f1', border: '1px solid rgba(26,26,24,0.08)', lineHeight: 1.7, color: '#5b5348' }}>
            申請 reference：<span style={{ color: '#1a1a18' }}>{params.id}</span>
          </div>
        ) : null}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '999px', background: '#1a1a18', color: '#f5efe5', padding: '14px 18px', textDecoration: 'none', fontSize: '14px' }}>
            返回首頁
          </Link>
          <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '999px', background: '#fff', color: '#1a1a18', padding: '14px 18px', textDecoration: 'none', fontSize: '14px', border: '1px solid rgba(26,26,24,0.12)' }}>
            Google Login
          </Link>
          <Link href="/apply" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '999px', background: '#fff', color: '#1a1a18', padding: '14px 18px', textDecoration: 'none', fontSize: '14px', border: '1px solid rgba(26,26,24,0.12)' }}>
            再睇一次申請頁
          </Link>
        </div>
      </section>
    </main>
  )
}
