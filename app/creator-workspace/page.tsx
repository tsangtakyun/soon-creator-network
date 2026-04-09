import { cookies } from 'next/headers'
import Link from 'next/link'

import CreatorPlanPaymentButton from '@/app/creator-workspace/payment-button'
import { getCreatorCreditSummary, getCreatorToolAccessWithBalance, listCreatorApplicationsByEmail } from '@/lib/creator-admin'
import { getCreatorPlanById, isPaidCreatorPlan } from '@/lib/creator-network'
import { createServerSupabase } from '@/lib/server-supabase'

const shellStyle = {
  minHeight: '100vh',
  padding: '40px 24px 100px',
  color: '#f7f8fb',
} as const

const containerStyle = {
  maxWidth: '1240px',
  margin: '0 auto',
  display: 'grid',
  gap: '20px',
} as const

const cardStyle = {
  position: 'relative',
  overflow: 'hidden',
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

const primaryButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '52px',
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
  minHeight: '52px',
  padding: '0 20px',
  borderRadius: '999px',
  border: '1px solid rgba(255,255,255,0.14)',
  background: 'rgba(255,255,255,0.05)',
  color: '#f4f7ff',
  textDecoration: 'none',
  fontSize: '14px',
} as const

export default async function CreatorWorkspacePage() {
  const cookieStore = await cookies()
  const supabase = createServerSupabase(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()
  const email = user?.email?.toLowerCase() ?? ''
  const applications = email ? await listCreatorApplicationsByEmail(email) : []
  const latestApplication = applications[0]
  const selectedPlan = latestApplication?.selected_plan || 'creator-core'
  const paymentStatus = latestApplication?.plan_payment_status || (selectedPlan === 'creator-core' ? 'not_required' : 'pending')
  const selectedPlanMeta = getCreatorPlanById(selectedPlan)
  const creditSummary = await getCreatorCreditSummary(latestApplication)
  const tools = getCreatorToolAccessWithBalance(latestApplication, creditSummary.remaining)
  const needsPayment = latestApplication && isPaidCreatorPlan(selectedPlan) && paymentStatus !== 'paid'

  return (
    <main style={shellStyle}>
      <div style={containerStyle}>
        <section style={{ ...cardStyle, padding: '38px' }}>
          <div style={eyebrowStyle}>創作者工作台</div>
          <h1
            style={{
              margin: '0 0 14px',
              fontSize: 'clamp(2.6rem, 5vw, 4.5rem)',
              lineHeight: 0.96,
              letterSpacing: '-0.07em',
              fontWeight: 350,
            }}
          >
            {latestApplication?.creator_name
              ? `${latestApplication.creator_name} 的工作台`
              : 'SOON 創作者工作台'}
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: '920px',
              color: 'rgba(210,217,234,0.8)',
              fontSize: '18px',
              lineHeight: 1.8,
            }}
          >
            你可以在這裡查看方案狀態、工具權限、信用點數與創作者資料摘要，之後亦會由這裡承接合作機會與內容工作流程。
          </p>
        </section>

        {latestApplication ? (
          <section
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.08fr) 0.92fr',
              gap: '18px',
            }}
          >
            <section style={{ ...cardStyle, padding: '24px' }}>
              <div style={eyebrowStyle}>方案狀態</div>
              <div style={{ fontSize: '38px', lineHeight: 1.04, marginBottom: '10px', fontWeight: 350 }}>{selectedPlanMeta.name}</div>
              <div style={{ color: 'rgba(216,221,235,0.78)', lineHeight: 1.8, marginBottom: '14px' }}>{selectedPlanMeta.description}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                <StatusPill
                  label={`付款狀態：${paymentStatus === 'paid' ? '已完成' : paymentStatus === 'not_required' ? '無需付款' : '待付款'}`}
                />
                <StatusPill label={`審核狀態：${latestApplication.review_status || '新申請'}`} />
                <StatusPill label={`剩餘點數：${creditSummary.remaining} / ${creditSummary.allowance}`} />
              </div>
              <div
                style={{
                  padding: '16px',
                  borderRadius: '18px',
                  background: 'rgba(255,255,255,0.05)',
                  lineHeight: 1.8,
                  color: '#edf1ff',
                }}
              >
                {needsPayment
                  ? '你已選擇付費方案，但付款尚未完成。完成付款後，對應工具入口將即時開通。'
                  : '你目前可在此查看已啟用的工具、方案與點數狀態，之後亦會從這裡接收適合你的合作機會。'}
              </div>
            </section>

            <section style={{ ...cardStyle, padding: '24px' }}>
              <div style={eyebrowStyle}>資料摘要</div>
              <div style={{ display: 'grid', gap: '10px' }}>
                {[
                  ['電子郵件', latestApplication.email],
                  ['主要平台', latestApplication.primary_platform || '未填寫'],
                  ['內容類別', latestApplication.content_categories || '未填寫'],
                  ['報價摘要', `${latestApplication.usual_reel_rate || '未填寫'} / ${latestApplication.usual_post_rate || '未填寫'} / ${latestApplication.usual_story_rate || '未填寫'}`],
                  ['AI 創作者類型', latestApplication.ai_analysis?.archetype || '尚未生成'],
                ].map(([label, value]) => (
                  <div key={label} style={{ padding: '14px 16px', borderRadius: '18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '12px', color: 'rgba(162,178,214,0.82)', marginBottom: '6px', letterSpacing: '0.08em' }}>{label}</div>
                    <div style={{ lineHeight: 1.7, color: '#eef2ff' }}>{value}</div>
                  </div>
                ))}
              </div>
            </section>
          </section>
        ) : (
          <section style={{ ...cardStyle, padding: '24px', lineHeight: 1.8, color: 'rgba(216,221,235,0.78)' }}>
            目前尚未找到你的創作者申請資料。請先完成申請流程，之後即可返回此工作台查看方案與工具狀態。
          </section>
        )}

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {tools.map((tool) => (
            <section key={tool.slug} style={{ ...cardStyle, padding: '24px', display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <div style={{ fontSize: '28px', lineHeight: 1.08, color: '#f7f9ff' }}>{tool.title}</div>
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: '999px',
                    background: tool.unlocked ? 'rgba(35,88,48,0.32)' : 'rgba(255,255,255,0.05)',
                    color: tool.unlocked ? '#b8efc3' : '#c7cfdf',
                    fontSize: '12px',
                  }}
                >
                  {tool.statusLabel}
                </div>
              </div>
              <div style={{ color: 'rgba(216,221,235,0.76)', lineHeight: 1.7 }}>{tool.description}</div>
              <div style={{ color: '#f4f7ff' }}>{tool.quotaLabel}</div>
              {tool.creditCostLabel ? <div style={{ color: 'rgba(162,178,214,0.8)', fontSize: '14px' }}>{tool.creditCostLabel}</div> : null}
              {tool.unlocked ? (
                <Link href={`/tools/${tool.slug}`} style={primaryButtonStyle}>
                  進入工具
                </Link>
              ) : (
                <div style={{ ...secondaryButtonStyle, opacity: 0.72 }}>
                  尚未開通
                </div>
              )}
            </section>
          ))}
        </section>

        {needsPayment && latestApplication ? (
          <section style={{ ...cardStyle, padding: '24px', display: 'grid', gap: '12px' }}>
            <div style={eyebrowStyle}>待完成付款</div>
            <div style={{ fontSize: '34px', lineHeight: 1.06, fontWeight: 350 }}>
              完成付款後即可啟用 {selectedPlanMeta.name}
            </div>
            <div style={{ color: 'rgba(216,221,235,0.78)', lineHeight: 1.8 }}>
              你已完成申請，下一步只需完成 Stripe 付款。付款完成後，對應方案與工具入口將立即開通。
            </div>
            <CreatorPlanPaymentButton
              applicationId={latestApplication.id}
              email={latestApplication.email}
              selectedPlan={selectedPlan}
            />
          </section>
        ) : null}

        {latestApplication ? (
          <section style={{ ...cardStyle, padding: '24px', display: 'grid', gap: '10px' }}>
            <div style={eyebrowStyle}>點數紀錄</div>
            <div style={{ fontSize: '30px', lineHeight: 1.08, fontWeight: 350 }}>
              本月已使用 {creditSummary.used} 點，剩餘 {creditSummary.remaining} 點
            </div>
            <div style={{ color: 'rgba(216,221,235,0.78)', lineHeight: 1.8 }}>
              第一版點數記錄已開始追蹤每次工具使用。後續將再補上每月補點、加購點數與更細緻的使用分析。
            </div>
            {!creditSummary.ledgerReady ? (
              <div style={{ padding: '14px 16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', color: '#c7cfdf', lineHeight: 1.8 }}>
                點數記錄資料表尚未完全啟用，因此目前先以方案配額顯示。待 `creator_usage_ledger` 建立後，即會開始記錄實際扣點。
              </div>
            ) : null}
          </section>
        ) : null}
      </div>
    </main>
  )
}

function StatusPill({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: '10px 14px',
        borderRadius: '999px',
        background: 'rgba(255,255,255,0.08)',
        color: '#eef2ff',
      }}
    >
      {label}
    </div>
  )
}
