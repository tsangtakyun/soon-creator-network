import Link from 'next/link'

import { listApprovedCreators } from '@/lib/creator-admin'

const pageStyle = {
  minHeight: '100vh',
  padding: '40px 24px 100px',
  color: '#f7f8fb',
} as const

const containerStyle = {
  maxWidth: '1180px',
  margin: '0 auto',
  display: 'grid',
  gap: '18px',
} as const

const cardStyle = {
  borderRadius: '30px',
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'linear-gradient(180deg, rgba(13,15,21,0.92), rgba(7,8,12,0.94))',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 28px 80px rgba(0,0,0,0.36)',
} as const

const eyebrowStyle = {
  fontSize: '12px',
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  color: 'rgba(162,178,214,0.8)',
  marginBottom: '10px',
} as const

const secondaryButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '44px',
  padding: '0 16px',
  borderRadius: '999px',
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.04)',
  color: '#f1f4ff',
  textDecoration: 'none',
  fontSize: '14px',
} as const

export default async function ApprovedCreatorDatabasePage() {
  const creators = await listApprovedCreators()

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <section style={{ ...cardStyle, padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <div style={eyebrowStyle}>Approved Database</div>
              <h1
                style={{
                  margin: '0 0 12px',
                  fontSize: 'clamp(2.5rem, 5vw, 4.4rem)',
                  lineHeight: 0.96,
                  letterSpacing: '-0.07em',
                  fontWeight: 350,
                }}
              >
                已批核創作者資料庫
              </h1>
              <p
                style={{
                  margin: 0,
                  maxWidth: '820px',
                  fontSize: '17px',
                  lineHeight: 1.8,
                  color: 'rgba(210,217,234,0.8)',
                }}
              >
                集中查看已完成批核的創作者資料，方便後續配對、篩選與內部團隊跟進。
              </p>
            </div>

            <Link href="/internal/review" style={secondaryButtonStyle}>
              返回審核工作台
            </Link>
          </div>
        </section>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {creators.map((creator) => (
            <section key={creator.id} style={{ ...cardStyle, padding: '24px' }}>
              <div style={{ fontSize: '30px', lineHeight: 1.05, marginBottom: '12px', fontWeight: 350 }}>
                {creator.creator_name || creator.contact_name}
              </div>
              <div style={{ display: 'grid', gap: '10px', color: 'rgba(222,227,241,0.8)', lineHeight: 1.75 }}>
                <div><strong>創作者類型：</strong>{creator.ai_analysis?.archetype || '未生成'}</div>
                <div><strong>適合目標：</strong>{creator.ai_analysis?.fit_objective || '未生成'}</div>
                <div><strong>主要平台：</strong>{creator.primary_platform || '未填'}</div>
                <div><strong>內容類別：</strong>{creator.content_categories || '未填'}</div>
                <div><strong>已選方案：</strong>{creator.selected_plan || '未填'}</div>
                <div><strong>付款狀態：</strong>{creator.plan_payment_status || '未需要'}</div>
                <div><strong>報價參考：</strong>{creator.usual_reel_rate || '未填'} / {creator.usual_post_rate || '未填'} / {creator.usual_story_rate || '未填'}</div>
                <div><strong>可服務地區：</strong>{creator.available_regions || creator.audience_regions || '未填'}</div>
              </div>
              <div
                style={{
                  marginTop: '14px',
                  padding: '14px 16px',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: '#e8edff',
                  lineHeight: 1.75,
                }}
              >
                {creator.internal_notes || creator.ai_analysis?.fit_summary || '已完成批核，可納入後續合作配對名單。'}
              </div>
            </section>
          ))}

          {creators.length === 0 ? (
            <section
              style={{
                ...cardStyle,
                gridColumn: '1 / -1',
                padding: '24px',
                color: 'rgba(210,217,234,0.8)',
                lineHeight: 1.8,
              }}
            >
              目前尚未有已批核的創作者。可先到審核工作台完成首批批核，之後此處便會成為內部配對資料庫。
            </section>
          ) : null}
        </section>
      </div>
    </main>
  )
}
