import { cookies } from 'next/headers'
import Link from 'next/link'

import CreatorPlanPaymentButton from '@/app/creator-workspace/payment-button'
import { getCreatorCreditSummary, getCreatorToolAccessWithBalance, listCreatorApplicationsByEmail } from '@/lib/creator-admin'
import { getCreatorPlanById, isPaidCreatorPlan } from '@/lib/creator-network'
import { createServerSupabase } from '@/lib/server-supabase'

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
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f6f1e8 0%, #ece3d6 100%)', padding: '42px 24px 90px', fontFamily: 'Georgia, Times New Roman, serif', color: '#1a1a18' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'grid', gap: '18px' }}>
        <section style={{ padding: '30px', borderRadius: '28px', background: 'rgba(255,255,255,0.78)', border: '1px solid rgba(26,26,24,0.10)' }}>
          <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '0.18em', color: '#8b7c69' }}>CREATOR DASHBOARD</p>
          <h1 style={{ margin: '0 0 12px', fontSize: '52px', lineHeight: 1.02, fontWeight: 500 }}>
            {latestApplication?.creator_name ? `${latestApplication.creator_name} 的 Creator Dashboard` : 'SOON Creator Dashboard'}
          </h1>
          <p style={{ margin: 0, fontSize: '18px', lineHeight: 1.7, color: '#5b5348', maxWidth: '860px' }}>
            不論你揀咗免費定付費 plan，都會先返到自己 dashboard。之後會按你嘅 subscription 同付款狀態，開放題材庫、script creation、storyboard 同之後嘅 AI 生成影片入口。
          </p>
        </section>

        {latestApplication ? (
          <section style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '16px' }}>
            <section style={{ padding: '24px', borderRadius: '24px', background: '#1a1a18', color: '#f5efe5' }}>
              <div style={{ fontSize: '12px', letterSpacing: '0.16em', color: '#c7bdaf', marginBottom: '10px' }}>PLAN STATUS</div>
              <div style={{ fontSize: '38px', lineHeight: 1.04, marginBottom: '10px' }}>{selectedPlanMeta.name}</div>
              <div style={{ color: '#e4d8c8', lineHeight: 1.7, marginBottom: '12px' }}>{selectedPlanMeta.description}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                <div style={{ padding: '10px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)' }}>
                  Payment: {paymentStatus === 'paid' ? 'Paid' : paymentStatus === 'not_required' ? 'Not required' : 'Pending'}
                </div>
                <div style={{ padding: '10px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)' }}>
                  Review: {latestApplication.review_status || 'new'}
                </div>
                <div style={{ padding: '10px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)' }}>
                  Credits: {creditSummary.remaining} / {creditSummary.allowance}
                </div>
              </div>
              {needsPayment ? (
                <div style={{ padding: '16px', borderRadius: '18px', background: 'rgba(255,255,255,0.08)', lineHeight: 1.7 }}>
                  你已經揀咗付費 creator plan，但付款仲未完成。完成付款後，對應工具入口就會即時開通。
                </div>
              ) : (
                <div style={{ padding: '16px', borderRadius: '18px', background: 'rgba(255,255,255,0.08)', lineHeight: 1.7 }}>
                  你而家可以喺呢度睇返自己已啟用嘅 tools，同埋之後收到適合你類型嘅 creator jobs。
                </div>
              )}
            </section>

            <section style={{ padding: '24px', borderRadius: '24px', background: 'rgba(255,255,255,0.78)', border: '1px solid rgba(26,26,24,0.10)' }}>
              <div style={{ fontSize: '12px', letterSpacing: '0.16em', color: '#8b7c69', marginBottom: '10px' }}>PROFILE SNAPSHOT</div>
              <div style={{ display: 'grid', gap: '10px', color: '#5b5348' }}>
                <div><strong>Email:</strong> {latestApplication.email}</div>
                <div><strong>Primary Platform:</strong> {latestApplication.primary_platform || '未填'}</div>
                <div><strong>Categories:</strong> {latestApplication.content_categories || '未填'}</div>
                <div><strong>Rate:</strong> {latestApplication.usual_reel_rate || '未填'} / {latestApplication.usual_post_rate || '未填'} / {latestApplication.usual_story_rate || '未填'}</div>
                <div><strong>AI Archetype:</strong> {latestApplication.ai_analysis?.archetype || '未生成'}</div>
              </div>
            </section>
          </section>
        ) : (
          <section style={{ padding: '24px', borderRadius: '24px', background: 'rgba(255,255,255,0.78)', border: '1px solid rgba(26,26,24,0.10)', lineHeight: 1.8, color: '#5b5348' }}>
            你而家仲未有 creator application。先去填 onboarding form，之後就會返嚟呢個 dashboard。
          </section>
        )}

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {tools.map((tool) => (
            <section key={tool.slug} style={{ padding: '24px', borderRadius: '24px', background: 'rgba(255,255,255,0.80)', border: '1px solid rgba(26,26,24,0.10)', display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <div style={{ fontSize: '28px', lineHeight: 1.08 }}>{tool.title}</div>
                <div style={{ padding: '8px 12px', borderRadius: '999px', background: tool.unlocked ? '#e8f0df' : '#fbf8f1', color: tool.unlocked ? '#375334' : '#7a7266', fontSize: '12px' }}>
                  {tool.statusLabel}
                </div>
              </div>
              <div style={{ color: '#5b5348', lineHeight: 1.7 }}>{tool.description}</div>
              <div style={{ color: '#1a1a18' }}>{tool.quotaLabel}</div>
              {tool.creditCostLabel ? <div style={{ color: '#8b7c69', fontSize: '14px' }}>{tool.creditCostLabel}</div> : null}
              {tool.unlocked ? (
                <Link href={`/tools/${tool.slug}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '999px', background: '#1a1a18', color: '#f5efe5', padding: '12px 16px', textDecoration: 'none' }}>
                  進入
                </Link>
              ) : (
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '999px', background: '#f3eee4', color: '#8b7c69', padding: '12px 16px' }}>
                  未開通
                </div>
              )}
            </section>
          ))}
        </section>

        {needsPayment && latestApplication ? (
          <section style={{ padding: '24px', borderRadius: '24px', background: 'rgba(255,255,255,0.78)', border: '1px solid rgba(26,26,24,0.10)', display: 'grid', gap: '12px' }}>
            <div style={{ fontSize: '12px', letterSpacing: '0.16em', color: '#8b7c69' }}>PAYMENT REQUIRED</div>
            <div style={{ fontSize: '34px', lineHeight: 1.06 }}>完成付款後先會開通 {selectedPlanMeta.name}</div>
            <div style={{ color: '#5b5348', lineHeight: 1.7 }}>
              你已經完成申請，下一步只差完成 Stripe 付款。付款後你個 plan 會正式啟動，對應 tools 會立即開通。
            </div>
            <CreatorPlanPaymentButton
              applicationId={latestApplication.id}
              email={latestApplication.email}
              selectedPlan={selectedPlan}
            />
          </section>
        ) : null}

        {latestApplication ? (
          <section style={{ padding: '24px', borderRadius: '24px', background: 'rgba(255,255,255,0.78)', border: '1px solid rgba(26,26,24,0.10)', display: 'grid', gap: '10px' }}>
            <div style={{ fontSize: '12px', letterSpacing: '0.16em', color: '#8b7c69' }}>CREDIT LEDGER</div>
            <div style={{ fontSize: '30px', lineHeight: 1.08 }}>本月已用 {creditSummary.used} credits，剩餘 {creditSummary.remaining} credits</div>
            <div style={{ color: '#5b5348', lineHeight: 1.7 }}>
              第一版 credit ledger 已開始記錄每次工具使用。之後再補 monthly refill、加購 credits 同更細 usage analytics。
            </div>
          </section>
        ) : null}
      </div>
    </main>
  )
}
