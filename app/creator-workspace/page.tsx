export default function CreatorWorkspacePage() {
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f6f1e8 0%, #ece3d6 100%)', padding: '42px 24px 90px', fontFamily: 'Georgia, Times New Roman, serif', color: '#1a1a18' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto', display: 'grid', gap: '18px' }}>
        <section style={{ padding: '30px', borderRadius: '28px', background: 'rgba(255,255,255,0.78)', border: '1px solid rgba(26,26,24,0.10)' }}>
          <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '0.18em', color: '#8b7c69' }}>CREATOR WORKSPACE</p>
          <h1 style={{ margin: '0 0 12px', fontSize: '52px', lineHeight: 1.02, fontWeight: 500 }}>Creator Workspace 即將開放</h1>
          <p style={{ margin: 0, fontSize: '18px', lineHeight: 1.7, color: '#5b5348', maxWidth: '760px' }}>
            你已經成功登入 SOON Creator Network。下一版會喺呢度見到已批核資料、適合你嘅 job、可用題材庫，以及你可以用到嘅 AI tools 計劃。
          </p>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          {[
            {
              title: 'Approved Profile',
              body: '之後會喺呢度睇返你提交咗嘅 creator profile、平台定位、AI 分析同 internal review 狀態。',
            },
            {
              title: 'Creator Jobs',
              body: '之後會喺呢度收到適合你類型嘅 client campaign matching，同時睇返每個 job 嘅報價同付款保障。',
            },
            {
              title: 'SOON Tools',
              body: '之後會喺呢度睇到題材庫、AI planning、AI gen 片配額同 creator 專用計劃。',
            },
          ].map((card) => (
            <section key={card.title} style={{ padding: '24px', borderRadius: '24px', background: 'rgba(255,255,255,0.78)', border: '1px solid rgba(26,26,24,0.10)' }}>
              <div style={{ fontSize: '28px', lineHeight: 1.08, marginBottom: '10px' }}>{card.title}</div>
              <div style={{ lineHeight: 1.8, color: '#5b5348' }}>{card.body}</div>
            </section>
          ))}
        </section>
      </div>
    </main>
  )
}
