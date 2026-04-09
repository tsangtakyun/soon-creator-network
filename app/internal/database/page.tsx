import { listApprovedCreators } from '@/lib/creator-admin'

export default async function ApprovedCreatorDatabasePage() {
  const creators = await listApprovedCreators()

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f6f1e8 0%, #ece3d6 100%)', padding: '42px 24px 90px', fontFamily: 'Georgia, Times New Roman, serif', color: '#1a1a18' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'grid', gap: '20px' }}>
        <section style={{ padding: '30px', borderRadius: '28px', background: 'rgba(255,255,255,0.82)', border: '1px solid rgba(26,26,24,0.10)' }}>
          <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '0.18em', color: '#8b7c69' }}>APPROVED DATABASE</p>
          <h1 style={{ margin: '0 0 12px', fontSize: '54px', lineHeight: 1.02, fontWeight: 500 }}>Approved Creator Database</h1>
          <p style={{ margin: 0, fontSize: '18px', lineHeight: 1.7, color: '#5b5348', maxWidth: '840px' }}>
            呢度係已經批核可用嘅 creator pool。之後 external client 嗰邊 creator matching，可以直接食呢個 approved database。
          </p>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {creators.map((creator) => (
            <section key={creator.id} style={{ padding: '24px', borderRadius: '24px', background: 'rgba(255,255,255,0.80)', border: '1px solid rgba(26,26,24,0.10)' }}>
              <div style={{ fontSize: '30px', lineHeight: 1.05, marginBottom: '12px' }}>{creator.creator_name || creator.contact_name}</div>
              <div style={{ display: 'grid', gap: '10px', color: '#5b5348' }}>
                <div><strong>Archetype:</strong> {creator.ai_analysis?.archetype || '未生成'}</div>
                <div><strong>Fit:</strong> {creator.ai_analysis?.fit_objective || '未生成'}</div>
                <div><strong>Platform:</strong> {creator.primary_platform || '未填'}</div>
                <div><strong>Category:</strong> {creator.content_categories || '未填'}</div>
                <div><strong>Plan:</strong> {creator.selected_plan || '未填'}</div>
                <div><strong>Plan Payment:</strong> {creator.plan_payment_status || '未需要'}</div>
                <div><strong>Rate:</strong> {creator.usual_reel_rate || '未填'} / {creator.usual_post_rate || '未填'} / {creator.usual_story_rate || '未填'}</div>
                <div><strong>Regions:</strong> {creator.available_regions || creator.audience_regions || '未填'}</div>
              </div>
              <div style={{ marginTop: '14px', padding: '14px 16px', borderRadius: '16px', background: '#fbf8f1', border: '1px solid rgba(26,26,24,0.08)', color: '#5b5348', lineHeight: 1.7 }}>
                {creator.internal_notes || creator.ai_analysis?.fit_summary || '已批核，可放入 creator matching pool。'}
              </div>
            </section>
          ))}
          {creators.length === 0 ? (
            <section style={{ gridColumn: '1 / -1', padding: '24px', borderRadius: '24px', background: 'rgba(255,255,255,0.80)', border: '1px solid rgba(26,26,24,0.10)', color: '#5b5348', lineHeight: 1.7 }}>
              未有已批核 creator。先去 internal review 批核一批 creator，之後呢度就會變成 matching pool。
            </section>
          ) : null}
        </section>
      </div>
    </main>
  )
}
