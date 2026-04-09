import Link from 'next/link'

import { buildCreatorValueProps } from '@/lib/creator-network'

export default function HomePage() {
  const valueProps = buildCreatorValueProps()

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f6f1e8 0%, #ece3d6 100%)', padding: '42px 24px 90px', fontFamily: 'Georgia, Times New Roman, serif', color: '#1a1a18' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'grid', gap: '20px' }}>
        <section style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.08fr) 0.92fr', gap: '20px' }}>
          <section style={{ padding: '30px', borderRadius: '28px', background: 'rgba(255,255,255,0.78)', border: '1px solid rgba(26,26,24,0.10)' }}>
            <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '0.18em', color: '#8b7c69' }}>SOON CREATOR NETWORK</p>
            <h1 style={{ margin: '0 0 12px', fontSize: '62px', lineHeight: 0.98, fontWeight: 500 }}>人人都可以做 Content Creator</h1>
            <p style={{ margin: '0 0 18px', fontSize: '20px', lineHeight: 1.7, color: '#5b5348', maxWidth: '760px' }}>
              加入 SOON Creator Network，安全接 job、唔怕拖數、仲可以用 SOON 嘅題材庫同 AI tools 幫你成長。
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <Link href="/apply" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '999px', background: '#1a1a18', color: '#f5efe5', padding: '14px 18px', textDecoration: 'none', fontSize: '14px' }}>
                立即登記
              </Link>
              <Link href="/login?next=/creator-workspace" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '999px', background: '#fff', color: '#1a1a18', padding: '14px 18px', textDecoration: 'none', fontSize: '14px', border: '1px solid rgba(26,26,24,0.12)' }}>
                Google Login 入 Dashboard
              </Link>
              <a href="#why-join" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '999px', background: '#fff', color: '#1a1a18', padding: '14px 18px', textDecoration: 'none', fontSize: '14px', border: '1px solid rgba(26,26,24,0.12)' }}>
                了解加入好處
              </a>
            </div>
          </section>

          <section style={{ padding: '26px', borderRadius: '28px', background: '#1d1d1b', color: '#f5f0e6' }}>
            <div style={{ fontSize: '12px', letterSpacing: '0.14em', color: '#b8b0a2', marginBottom: '10px' }}>WHY JOIN</div>
            <div style={{ display: 'grid', gap: '12px' }} id="why-join">
              {valueProps.map((item) => (
                <div key={item} style={{ padding: '14px 16px', borderRadius: '16px', background: 'rgba(255,255,255,0.08)', lineHeight: 1.7 }}>
                  {item}
                </div>
              ))}
            </div>
          </section>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          {[
            {
              title: '接 job 有保障',
              body: '所有 job 經 SOON system 跑，客戶 full payment 後先進行交付流程，creator 唔使驚拖數。',
            },
            {
              title: '有題材、有工具',
              body: 'SOON internal system 會持續有題材庫、campaign planning 同 AI gen tools，俾 creator 按需要使用。',
            },
            {
              title: '自由，不綁死',
              body: '唔使簽死約，唔使交出命運控制權，自己決定接唔接合作、用唔用工具、做邊個方向。',
            },
          ].map((card) => (
            <section key={card.title} style={{ padding: '24px', borderRadius: '24px', background: 'rgba(255,255,255,0.78)', border: '1px solid rgba(26,26,24,0.10)' }}>
              <div style={{ fontSize: '30px', lineHeight: 1.08, marginBottom: '10px' }}>{card.title}</div>
              <div style={{ lineHeight: 1.8, color: '#5b5348' }}>{card.body}</div>
            </section>
          ))}
        </section>
      </div>
    </main>
  )
}
