import { cookies } from 'next/headers'
import Link from 'next/link'

import { listCreatorApplicationsByEmail } from '@/lib/creator-admin'
import { buildCreatorToolAccess, getCreatorMonthlyCredits } from '@/lib/creator-network'
import { createServerSupabase } from '@/lib/server-supabase'

const toolCopy: Record<string, { title: string; body: string }> = {
  'idea-library': {
    title: '題材庫',
    body: '由呢個 gateway 入去 SOON 題材庫。之後 creator 每次真正使用時，可以按 plan 扣 1 credit。',
  },
  'script-creation': {
    title: 'Script Creation',
    body: '由呢個 gateway 入去 SOON Script Generator。之後 creator 每次真正使用時，可以按 plan 扣 2 credits。',
  },
  'storyboard': {
    title: 'Storyboard',
    body: '由呢個 gateway 入去 SOON Storyboard。之後 creator 每次真正使用時，可以按 plan 扣 2 credits。',
  },
  'ai-video': {
    title: 'AI 生成影片',
    body: 'AI 生片入口會之後再逐步開放到 creator plans。',
  },
}

const internalToolLinks: Record<string, { label: string; href: string }> = {
  'idea-library': {
    label: '前往 SOON 題材庫',
    href: 'https://idea-brainstorm.vercel.app',
  },
  'script-creation': {
    label: '前往 SOON Script Generator',
    href: 'https://script-generator-xi.vercel.app',
  },
  'storyboard': {
    label: '前往 SOON Storyboard',
    href: 'https://soon-storyboard.vercel.app',
  },
}

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
  const monthlyCredits = getCreatorMonthlyCredits(
    latestApplication?.selected_plan || 'creator-core',
    latestApplication?.plan_payment_status || 'not_required'
  )
  const access = buildCreatorToolAccess(
    latestApplication?.selected_plan || 'creator-core',
    latestApplication?.plan_payment_status || 'not_required'
  ).find((item) => item.slug === tool)
  const internalLink = internalToolLinks[tool]

  const copy = toolCopy[tool] ?? {
    title: 'Creator Tool',
    body: '呢個入口之後會再細化。',
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f6f1e8 0%, #ece3d6 100%)', padding: '42px 24px 90px', fontFamily: 'Georgia, Times New Roman, serif', color: '#1a1a18' }}>
      <div style={{ maxWidth: '920px', margin: '0 auto', display: 'grid', gap: '18px' }}>
        <section style={{ padding: '30px', borderRadius: '28px', background: 'rgba(255,255,255,0.78)', border: '1px solid rgba(26,26,24,0.10)' }}>
          <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '0.18em', color: '#8b7c69' }}>CREATOR TOOL</p>
          <h1 style={{ margin: '0 0 12px', fontSize: '52px', lineHeight: 1.02, fontWeight: 500 }}>{copy.title}</h1>
          <p style={{ margin: 0, fontSize: '18px', lineHeight: 1.7, color: '#5b5348' }}>{copy.body}</p>
        </section>

        <section style={{ padding: '24px', borderRadius: '24px', background: access?.unlocked ? '#1a1a18' : 'rgba(255,255,255,0.78)', color: access?.unlocked ? '#f5efe5' : '#1a1a18', border: '1px solid rgba(26,26,24,0.10)' }}>
          <div style={{ fontSize: '12px', letterSpacing: '0.16em', color: access?.unlocked ? '#c7bdaf' : '#8b7c69', marginBottom: '10px' }}>ACCESS</div>
          <div style={{ fontSize: '34px', lineHeight: 1.06, marginBottom: '10px' }}>
            {access?.unlocked ? `已開通 · ${access.quotaLabel}` : '暫未開通'}
          </div>
          <div style={{ lineHeight: 1.7, color: access?.unlocked ? '#e8ddcf' : '#5b5348', marginBottom: '14px' }}>
            {access?.unlocked
              ? '你個 creator plan 已經有權限進入呢個工具入口。第一版會先由 gateway 帶你入 SOON 內部工具，之後再補真正 credit ledger。'
              : '你目前 plan 未開通呢個工具，或者付款仲未完成。之後完成升級後就會開放。'}
          </div>
          {access?.unlocked && access.creditCostLabel ? (
            <div style={{ marginBottom: '14px', padding: '14px 16px', borderRadius: '16px', background: 'rgba(255,255,255,0.08)', lineHeight: 1.7, color: '#e8ddcf' }}>
              你目前 plan 每月有 {monthlyCredits} credits。{access.creditCostLabel}
            </div>
          ) : null}
          {access?.unlocked && internalLink ? (
            <a
              href={internalLink.href}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '999px', background: '#f5efe5', color: '#1a1a18', padding: '12px 16px', textDecoration: 'none', marginRight: '10px' }}
            >
              {internalLink.label}
            </a>
          ) : null}
          <Link href="/creator-workspace" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '999px', background: access?.unlocked ? '#f5efe5' : '#1a1a18', color: access?.unlocked ? '#1a1a18' : '#f5efe5', padding: '12px 16px', textDecoration: 'none' }}>
            返回 Creator Dashboard
          </Link>
        </section>
      </div>
    </main>
  )
}
