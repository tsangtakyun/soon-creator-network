'use client'

import { useMemo, useState, useTransition } from 'react'

import type { CreatorApplicationRecord } from '@/lib/creator-admin'

type ReviewPageProps = {
  initialApplications: CreatorApplicationRecord[]
}

function statusLabel(status: string) {
  switch (status) {
    case 'approved':
      return 'Approved'
    case 'revision':
      return 'Needs Revision'
    case 'rejected':
      return 'Rejected'
    default:
      return 'New'
  }
}

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
    setFeedback(reviewStatus === 'approved' ? '正在批核 creator...' : '正在更新 review 狀態...')

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
          throw new Error(result.error || '更新 review 失敗。')
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
        setFeedback(reviewStatus === 'approved' ? '已放入 approved creator database。' : 'review 狀態已更新。')
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : '更新 review 失敗。')
      }
    })
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f6f1e8 0%, #ece3d6 100%)', padding: '42px 24px 90px', fontFamily: 'Georgia, Times New Roman, serif', color: '#1a1a18' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gap: '20px' }}>
        <section style={{ padding: '30px', borderRadius: '28px', background: 'rgba(255,255,255,0.82)', border: '1px solid rgba(26,26,24,0.10)' }}>
          <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '0.18em', color: '#8b7c69' }}>INTERNAL REVIEW</p>
          <h1 style={{ margin: '0 0 12px', fontSize: '54px', lineHeight: 1.02, fontWeight: 500 }}>Creator Review Queue</h1>
          <p style={{ margin: 0, fontSize: '18px', lineHeight: 1.7, color: '#5b5348', maxWidth: '840px' }}>
            喺呢度 review 新申請 creator，睇 AI 初步分析、平台資料、內容定位同商業合作能力。批核後，creator 會進入 approved database，之後 external client matching 就可以用。
          </p>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            ['Pending Review', grouped.pending.length.toString(), '等待你 decide 放唔放入 database'],
            ['Approved Creators', grouped.approved.length.toString(), '已可用於 client matching'],
            ['Rejected / Parked', grouped.rejected.length.toString(), '暫時唔建議入 pool'],
          ].map(([title, value, body]) => (
            <section key={title} style={{ padding: '22px', borderRadius: '22px', background: 'rgba(255,255,255,0.78)', border: '1px solid rgba(26,26,24,0.10)' }}>
              <div style={{ fontSize: '12px', letterSpacing: '0.16em', color: '#8b7c69', marginBottom: '10px' }}>{title}</div>
              <div style={{ fontSize: '44px', lineHeight: 1, marginBottom: '8px' }}>{value}</div>
              <div style={{ color: '#5b5348', lineHeight: 1.7 }}>{body}</div>
            </section>
          ))}
        </section>

        {feedback ? (
          <section style={{ padding: '14px 16px', borderRadius: '18px', background: 'rgba(228,239,221,0.90)', border: '1px solid rgba(26,26,24,0.08)', color: '#38442f', lineHeight: 1.7 }}>
            {feedback}
          </section>
        ) : null}

        <section style={{ display: 'grid', gap: '16px' }}>
          {applications.map((application) => (
            <section key={application.id} style={{ padding: '24px', borderRadius: '24px', background: 'rgba(255,255,255,0.80)', border: '1px solid rgba(26,26,24,0.10)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '18px' }}>
                <div style={{ display: 'grid', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
                    <div>
                      <div style={{ fontSize: '12px', letterSpacing: '0.16em', color: '#8b7c69', marginBottom: '6px' }}>CREATOR</div>
                      <div style={{ fontSize: '34px', lineHeight: 1.04 }}>{application.creator_name || application.contact_name}</div>
                    </div>
                    <div style={{ padding: '10px 14px', borderRadius: '999px', background: '#fbf8f1', border: '1px solid rgba(26,26,24,0.08)', color: '#5b5348' }}>
                      {statusLabel(application.review_status)}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {[
                      ['Email', application.email],
                      ['WhatsApp', application.whatsapp],
                      ['Location', application.location],
                      ['Primary Platform', application.primary_platform],
                      ['Content Categories', application.content_categories],
                      ['Selected Plan', application.selected_plan],
                      ['Reel / Post / Story', `${application.usual_reel_rate || '未填'} / ${application.usual_post_rate || '未填'} / ${application.usual_story_rate || '未填'}`],
                    ].map(([label, value]) => (
                      <div key={label} style={{ padding: '14px 16px', borderRadius: '16px', background: '#fbf8f1', border: '1px solid rgba(26,26,24,0.08)' }}>
                        <div style={{ fontSize: '12px', color: '#8b7c69', marginBottom: '6px' }}>{label}</div>
                        <div style={{ lineHeight: 1.7 }}>{value || '未填'}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: '16px', borderRadius: '18px', background: '#fbf8f1', border: '1px solid rgba(26,26,24,0.08)' }}>
                    <div style={{ fontSize: '12px', color: '#8b7c69', marginBottom: '8px' }}>TOP CONTENT LINKS</div>
                    <div style={{ lineHeight: 1.8, color: '#5b5348' }}>{application.top_content_links || '未填'}</div>
                  </div>

                  <div style={{ padding: '16px', borderRadius: '18px', background: '#fbf8f1', border: '1px solid rgba(26,26,24,0.08)' }}>
                    <div style={{ fontSize: '12px', color: '#8b7c69', marginBottom: '8px' }}>28 日數據 / MEDIA KIT LINKS</div>
                    <div style={{ lineHeight: 1.8, color: '#5b5348' }}>{application.analytics_drive_links || application.analytics_notes || '未填'}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '14px' }}>
                  <div style={{ padding: '18px', borderRadius: '18px', background: '#1d1d1b', color: '#f5f0e6' }}>
                    <div style={{ fontSize: '12px', letterSpacing: '0.16em', color: '#c9c0b3', marginBottom: '8px' }}>AI SNAPSHOT</div>
                    <div style={{ display: 'grid', gap: '10px' }}>
                      <div><strong>Archetype:</strong> {application.ai_analysis?.archetype || '未生成'}</div>
                      <div><strong>Fit Objective:</strong> {application.ai_analysis?.fit_objective || '未生成'}</div>
                      <div><strong>Strength:</strong> {application.ai_analysis?.strength_summary || '未生成'}</div>
                      <div><strong>Fit Summary:</strong> {application.ai_analysis?.fit_summary || '未生成'}</div>
                    </div>
                  </div>

                  <div style={{ padding: '16px', borderRadius: '18px', background: '#fbf8f1', border: '1px solid rgba(26,26,24,0.08)' }}>
                    <div style={{ fontSize: '12px', color: '#8b7c69', marginBottom: '8px' }}>INTERNAL NOTES</div>
                    <textarea
                      value={editingNotes[application.id] ?? ''}
                      onChange={(event) => updateNotes(application.id, event.target.value)}
                      style={{ width: '100%', minHeight: '120px', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(26,26,24,0.12)', background: '#fff', fontFamily: 'inherit', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.7 }}
                      placeholder="例如：適合 food conversion campaign、鏡頭感自然、應優先放入 HK food creator pool。"
                    />
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <button type="button" disabled={isPending} onClick={() => updateReview(application.id, 'approved')} style={{ border: 'none', borderRadius: '999px', background: '#1a1a18', color: '#f5efe5', padding: '12px 16px', cursor: 'pointer', opacity: isPending ? 0.72 : 1 }}>
                      批核放入 Database
                    </button>
                    <button type="button" disabled={isPending} onClick={() => updateReview(application.id, 'revision')} style={{ border: '1px solid rgba(26,26,24,0.12)', borderRadius: '999px', background: '#fff', color: '#1a1a18', padding: '12px 16px', cursor: 'pointer', opacity: isPending ? 0.72 : 1 }}>
                      要求補資料
                    </button>
                    <button type="button" disabled={isPending} onClick={() => updateReview(application.id, 'rejected')} style={{ border: '1px solid rgba(26,26,24,0.12)', borderRadius: '999px', background: '#fbf8f1', color: '#7d493f', padding: '12px 16px', cursor: 'pointer', opacity: isPending ? 0.72 : 1 }}>
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
