import { cookies } from 'next/headers'
import Link from 'next/link'

import CreatorToolUseButton from '@/app/tools/[tool]/use-button'
import { getCreatorCreditSummary, getCreatorToolAccessWithBalance, listCreatorApplicationsByEmail } from '@/lib/creator-admin'
import { createServerSupabase } from '@/lib/server-supabase'

const toolCopy: Record<string, { title: string; body: string }> = {
  'idea-library': {
    title: '題材庫',
    body: '由此入口前往 SOON 題材庫，整理更適合你的內容方向與題材構思。',
  },
  'script-creation': {
    title: '腳本規劃',
    body: '由此入口前往 SOON 腳本規劃工具，建立更完整的內容結構與腳本方向。',
  },
  storyboard: {
    title: '分鏡整理',
    body: '由此入口前往 SOON 分鏡工具，將內容進一步整理為鏡頭結構與拍攝方向。',
  },
  'ai-video': {
    title: 'AI 生成影片',
    body: 'AI 生成影片功能將於後續階段逐步開放至不同創作者方案。',
  },
}

const shellStyle = {
  minHeight: '100vh',
  padding: '40px 24px 100px',
  color: '#f7f8fb',
} as const

const containerStyle = {
  maxWidth: '920px',
  margin: '0 auto',
  display: 'grid',
  gap: '18px',
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

export default async function CreatorToolPage({
  params,
}: {
  params: Promise<{ tool: string }>
}) {
  const { tool } = await params
  const cookieStore = await cookies()
  const supabase = createServerSupabase(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()
  const email = user?.email?.toLowerCase() ?? ''
  const applications = email ? await listCreatorApplicationsByEmail(email) : []
  const latestApplication = applications[0]
  const creditSummary = await getCreatorCreditSummary(latestApplication)
  const access = getCreatorToolAccessWithBalance(
    latestApplication,
    creditSummary.remaining
  ).find((item) => item.slug === tool)

  const copy = toolCopy[tool] ?? {
    title: '創作者工具',
    body: '此工具入口將於後續版本進一步完善。',
  }

  return (
    <main style={shellStyle}>
      <div style={containerStyle}>
        <section style={{ ...cardStyle, padding: '36px' }}>
          <div style={eyebrowStyle}>工具入口</div>
          <h1
            style={{
              margin: '0 0 14px',
              fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
              lineHeight: 0.96,
              letterSpacing: '-0.07em',
              fontWeight: 350,
            }}
          >
            {copy.title}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: '18px',
              lineHeight: 1.8,
              color: 'rgba(210,217,234,0.8)',
            }}
          >
            {copy.body}
          </p>
        </section>

        <section style={{ ...cardStyle, padding: '24px' }}>
          <div style={eyebrowStyle}>使用狀態</div>
          <div style={{ fontSize: '34px', lineHeight: 1.06, marginBottom: '10px', fontWeight: 350 }}>
            {access?.unlocked ? `已開通 · ${access.quotaLabel}` : '尚未開通'}
          </div>
          <div style={{ lineHeight: 1.8, color: 'rgba(216,221,235,0.78)', marginBottom: '14px' }}>
            {access?.unlocked
              ? '你的創作者方案已具備使用此工具的權限。第一版會先由工具入口帶你前往對應系統，之後再補上更完整的點數與使用記錄。'
              : '你目前的方案尚未開通此工具，或付款仍未完成。完成升級後即可使用。'}
          </div>

          {access?.unlocked && access.creditCostLabel ? (
            <div
              style={{
                marginBottom: '14px',
                padding: '14px 16px',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.05)',
                lineHeight: 1.8,
                color: '#edf1ff',
              }}
            >
              你目前本月剩餘 {creditSummary.remaining} / {creditSummary.allowance} 點。{access.creditCostLabel}
            </div>
          ) : null}

          {access?.unlocked ? <CreatorToolUseButton toolSlug={tool} creditCost={access.creditCost} /> : null}

          <div style={{ marginTop: '14px' }}>
            <Link href="/creator-workspace" style={secondaryButtonStyle}>
              返回工作台
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
