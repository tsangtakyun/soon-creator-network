'use client'

import Link from 'next/link'
import { useMemo, useState, useTransition } from 'react'

import type { CreatorApplicationRecord } from '@/lib/creator-admin'

type ReviewPageProps = {
  initialApplications: CreatorApplicationRecord[]
}

function statusLabel(status: string) {
  switch (status) {
    case 'approved':
      return '已批核'
    case 'revision':
      return '待補資料'
    case 'rejected':
      return '暫不收錄'
    default:
      return '新申請'
  }
}

function statusPillStyle(status: string) {
  if (status === 'approved') {
    return {
      background: 'rgba(61, 139, 255, 0.16)',
      border: '1px solid rgba(94, 160, 255, 0.28)',
      color: '#d8e8ff',
    }
  }

  if (status === 'rejected') {
    return {
      background: 'rgba(181,69,69,0.16)',
      border: '1px solid rgba(255,255,255,0.06)',
      color: '#ffe7e3',
    }
  }

  return {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#eef2ff',
  }
}

const pageStyle = {
  minHeight: '100vh',
  padding: '40px 24px 100px',
  color: '#f7f8fb',
} as const

const containerStyle = {
  maxWidth: '1240px',
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

const subtleCardStyle = {
  padding: '16px',
  borderRadius: '18px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.06)',
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

export default function InternalReviewClientPage({ initialApplications }: ReviewPageProps) {
  const [applications, setApplications] = useState(initialApplications)
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>(
    Object.fromEntries(initialApplications.map((item) => [item.id, item.internal_notes ?? '']))
  )
  const [feedback, setFeedback] = useState('')
  const [isPending, startTransition] = useTransition()

  const grouped = useMemo(() => ({
    pending: applications.filter((item) => item.review_status === 'new' || item.review_status === 'revision'),
    approved: applications.filter((item) => item.review_status === 'approved'),
    rejected: applications.filter((item) => item.review_status === 'rejected'),
  }), [applications])

  function updateNotes(id: string, value: string) {
    setEditingNotes((prev) => ({ ...prev, [id]: value }))
  }

  function updateReview(id: string, reviewStatus: string) {
    setFeedback(reviewStatus === 'approved' ? '正在批核創作者申請...' : '正在更新審核狀態...')

    startTransition(async () => {
      try {
        const response = await fetch('/api/internal/creator-review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id,
            reviewStatus,
            internalNotes: editingNotes[id] ?? '',
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || '更新審核狀態失敗。')
        }

        setApplications((prev) => prev.map((item) => (
          item.id === id
            ? {
                ...item,
                review_status: reviewStatus,
                internal_notes: editingNotes[id] ?? '',
                approved_at: reviewStatus === 'approved' ? new Date().toISOString() : null,
              }
            : item
        )))
        setFeedback(reviewStatus === 'approved' ? '已加入已批核創作者資料庫。' : '審核狀態已更新。')
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : '更新審核狀態失敗。')
      }
    })
  }

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <section style={{ ...cardStyle, padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <div style={eyebrowStyle}>Internal Review</div>
              <h1
                style={{
                  margin: '0 0 12px',
                  fontSize: 'clamp(2.5rem, 5vw, 4.4rem)',
                  lineHeight: 0.96,
                  letterSpacing: '-0.07em',
                  fontWeight: 350,
                }}
              >
                創作者審核工作台
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
                集中檢視新申請、AI 分析、合作定位與內部備註。完成批核後，創作者會同步進入可供配對的資料庫。
              </p>
            </div>

            <Link href="/internal/database" style={secondaryButtonStyle}>
              查看已批核資料庫
            </Link>
          </div>
        </section>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          {[
            ['待處理申請', grouped.pending.length.toString(), '等待初步審核與狀態判斷'],
            ['已批核創作者', grouped.approved.length.toString(), '可供後續合作配對與資料庫使用'],
            ['暫不收錄', grouped.rejected.length.toString(), '現階段不納入配對名單'],
          ].map(([title, value, body]) => (
            <section key={title} style={{ ...cardStyle, padding: '22px' }}>
              <div style={eyebrowStyle}>{title}</div>
              <div style={{ fontSize: '42px', lineHeight: 1, marginBottom: '8px', fontWeight: 350 }}>{value}</div>
              <div style={{ color: 'rgba(210,217,234,0.74)', lineHeight: 1.8 }}>{body}</div>
            </section>
          ))}
        </section>

        {feedback ? (
          <section
            style={{
              padding: '14px 16px',
              borderRadius: '18px',
              background: 'rgba(61, 139, 255, 0.16)',
              border: '1px solid rgba(94, 160, 255, 0.28)',
              color: '#d8e8ff',
              lineHeight: 1.7,
            }}
          >
            {feedback}
          </section>
        ) : null}

        <section style={{ display: 'grid', gap: '16px' }}>
          {applications.map((application) => (
            <section key={application.id} style={{ ...cardStyle, padding: '24px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1.2fr) minmax(320px, 0.8fr)',
                  gap: '18px',
                }}
              >
                <div style={{ display: 'grid', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
                    <div>
                      <div style={eyebrowStyle}>Creator</div>
                      <div style={{ fontSize: '34px', lineHeight: 1.04, fontWeight: 350 }}>
                        {application.creator_name || application.contact_name}
                      </div>
                    </div>
                    <div style={{ ...statusPillStyle(application.review_status), padding: '10px 14px', borderRadius: '999px' }}>
                      {statusLabel(application.review_status)}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '12px',
                    }}
                  >
                    {[
                      ['電子郵件', application.email],
                      ['WhatsApp', application.whatsapp],
                      ['所在地區', application.location],
                      ['主要平台', application.primary_platform],
                      ['內容類別', application.content_categories],
                      ['已選方案', application.selected_plan],
                      ['方案付款狀態', application.plan_payment_status || '未需要'],
                      ['Reel / Post / Story', `${application.usual_reel_rate || '未填'} / ${application.usual_post_rate || '未填'} / ${application.usual_story_rate || '未填'}`],
                    ].map(([label, value]) => (
                      <div key={label} style={subtleCardStyle}>
                        <div style={{ fontSize: '12px', color: 'rgba(162,178,214,0.78)', marginBottom: '6px' }}>{label}</div>
                        <div style={{ lineHeight: 1.7, color: '#edf1ff' }}>{value || '未填'}</div>
                      </div>
                    ))}
                  </div>

                  <div style={subtleCardStyle}>
                    <div style={{ fontSize: '12px', color: 'rgba(162,178,214,0.78)', marginBottom: '8px' }}>代表內容連結</div>
                    <div style={{ lineHeight: 1.8, color: 'rgba(222,227,241,0.78)' }}>{application.top_content_links || '未填'}</div>
                  </div>

                  <div style={subtleCardStyle}>
                    <div style={{ fontSize: '12px', color: 'rgba(162,178,214,0.78)', marginBottom: '8px' }}>近 28 日數據 / Media Kit</div>
                    <div style={{ lineHeight: 1.8, color: 'rgba(222,227,241,0.78)' }}>
                      {application.analytics_drive_links || application.analytics_notes || '未填'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '14px' }}>
                  <div
                    style={{
                      padding: '18px',
                      borderRadius: '20px',
                      background: 'linear-gradient(180deg, rgba(24,30,44,0.96), rgba(13,15,22,0.94))',
                      border: '1px solid rgba(96,134,215,0.18)',
                    }}
                  >
                    <div style={eyebrowStyle}>AI Snapshot</div>
                    <div style={{ display: 'grid', gap: '10px', color: '#edf1ff', lineHeight: 1.8 }}>
                      <div><strong>創作者類型：</strong>{application.ai_analysis?.archetype || '未生成'}</div>
                      <div><strong>適合目標：</strong>{application.ai_analysis?.fit_objective || '未生成'}</div>
                      <div><strong>優勢摘要：</strong>{application.ai_analysis?.strength_summary || '未生成'}</div>
                      <div><strong>配對判斷：</strong>{application.ai_analysis?.fit_summary || '未生成'}</div>
                    </div>
                  </div>

                  <div style={subtleCardStyle}>
                    <div style={{ fontSize: '12px', color: 'rgba(162,178,214,0.78)', marginBottom: '8px' }}>內部備註</div>
                    <textarea
                      value={editingNotes[application.id] ?? ''}
                      onChange={(event) => updateNotes(application.id, event.target.value)}
                      style={{
                        width: '100%',
                        minHeight: '132px',
                        padding: '12px 14px',
                        borderRadius: '14px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(5,7,10,0.66)',
                        color: '#f2f5ff',
                        fontFamily: 'inherit',
                        fontSize: '14px',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                        lineHeight: 1.7,
                      }}
                      placeholder="例如：適合餐飲轉換型合作、鏡頭感自然、可優先納入香港餐飲創作者名單。"
                    />
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => updateReview(application.id, 'approved')}
                      style={{
                        minHeight: '46px',
                        border: '1px solid rgba(142,180,255,0.24)',
                        borderRadius: '999px',
                        background: 'linear-gradient(135deg, #1c72ff, #3d8bff)',
                        color: '#ffffff',
                        padding: '0 18px',
                        cursor: 'pointer',
                        boxShadow: '0 0 0 1px rgba(142,180,255,0.16), 0 0 28px rgba(27,114,255,0.24)',
                        opacity: isPending ? 0.72 : 1,
                      }}
                    >
                      批核並加入資料庫
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => updateReview(application.id, 'revision')}
                      style={{
                        minHeight: '46px',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '999px',
                        background: 'rgba(255,255,255,0.04)',
                        color: '#eef2ff',
                        padding: '0 18px',
                        cursor: 'pointer',
                        opacity: isPending ? 0.72 : 1,
                      }}
                    >
                      要求補充資料
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => updateReview(application.id, 'rejected')}
                      style={{
                        minHeight: '46px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '999px',
                        background: 'rgba(181,69,69,0.16)',
                        color: '#ffe7e3',
                        padding: '0 18px',
                        cursor: 'pointer',
                        opacity: isPending ? 0.72 : 1,
                      }}
                    >
                      暫不收錄
                    </button>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </section>
      </div>
    </main>
  )
}
