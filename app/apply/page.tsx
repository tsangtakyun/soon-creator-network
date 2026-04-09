'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  buildCreatorAiPreview,
  creatorAvailableRegionOptions,
  creatorContentCategoryOptions,
  creatorContentFormatOptions,
  creatorCountryOptions,
  creatorLanguageOptions,
  creatorRateRangeOptions,
  defaultCreatorApplyForm,
  getCreatorPlans,
  isPaidCreatorPlan,
} from '@/lib/creator-network'

export default function ApplyPage() {
  const router = useRouter()
  const [form, setForm] = useState(defaultCreatorApplyForm)
  const [submitError, setSubmitError] = useState('')
  const [submitMessage, setSubmitMessage] = useState('')
  const [isPending, startTransition] = useTransition()
  const preview = useMemo(() => buildCreatorAiPreview(form), [form])
  const plans = useMemo(() => getCreatorPlans(), [])

  function updateField(field: keyof typeof defaultCreatorApplyForm, value: string | string[]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function toggleMultiValue(
    field: 'languages' | 'contentCategories' | 'contentFormats' | 'availableRegions',
    value: string
  ) {
    setForm((prev) => {
      const current = prev[field]
      return {
        ...prev,
        [field]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      }
    })
  }

  function updateListField(
    field: 'audienceInsightLinks' | 'recentBrandCollabs' | 'recentConversionCampaigns' | 'topContentLinks',
    index: number,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].map((item, itemIndex) => (itemIndex === index ? value : item)),
    }))
  }

  function handleSubmit() {
    setSubmitError('')
    setSubmitMessage('先為你整理 creator onboarding 資料...')

    startTransition(async () => {
      try {
        const response = await fetch('/api/creator-apply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || '提交申請失敗，請稍後再試。')
        }

        if (isPaidCreatorPlan(form.selectedPlan)) {
          setSubmitMessage('已收到申請，正在建立 Stripe 付款流程...')

          const checkoutResponse = await fetch('/api/creator-plan/create-checkout-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              applicationId: result.id,
              email: form.email,
              selectedPlan: form.selectedPlan,
            }),
          })

          const checkoutResult = await checkoutResponse.json()

          if (!checkoutResponse.ok) {
            throw new Error(checkoutResult.error || '未能建立付款流程。')
          }

          if (!checkoutResult.url) {
            throw new Error('未收到 Stripe checkout URL。')
          }

          setSubmitMessage('即將跳去 Stripe 付款頁...')
          window.location.href = checkoutResult.url
          return
        }

        setSubmitMessage('已收到申請，準備跳去確認頁...')
        router.push(`/thank-you?id=${result.id}`)
      } catch (error) {
        setSubmitMessage('')
        setSubmitError(error instanceof Error ? error.message : '提交申請失敗，請稍後再試。')
      }
    })
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f6f1e8 0%, #ece3d6 100%)', padding: '42px 24px 90px', fontFamily: 'Georgia, Times New Roman, serif', color: '#1a1a18' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'grid', gap: '20px' }}>
        <section style={{ padding: '30px', borderRadius: '28px', background: 'rgba(255,255,255,0.78)', border: '1px solid rgba(26,26,24,0.10)' }}>
          <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '0.18em', color: '#8b7c69' }}>CREATOR APPLY</p>
          <h1 style={{ margin: '0 0 12px', fontSize: '52px', lineHeight: 1.02, fontWeight: 500 }}>登記成為 SOON Creator</h1>
          <p style={{ margin: 0, fontSize: '18px', lineHeight: 1.7, color: '#5b5348', maxWidth: '860px' }}>
            第一版先收集你嘅基本資料、平台 links、內容定位同過去 28 日平台數據 cap 圖。提交後，SOON 會用 AI 幫你分析邊類 campaign 最適合你，之後再放入 creator matching database。
          </p>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.05fr) 320px', gap: '22px', alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: '18px' }}>
            <section style={{ padding: '24px', borderRadius: '24px', background: 'rgba(255,255,255,0.78)', border: '1px solid rgba(26,26,24,0.10)' }}>
              <div style={{ fontSize: '12px', letterSpacing: '0.16em', color: '#8b7c69', marginBottom: '8px' }}>BASIC INFO</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  ['creatorName', 'Creator Name'],
                  ['contactName', '聯絡人名稱'],
                  ['email', 'Email'],
                  ['whatsapp', 'WhatsApp'],
                ].map(([key, label]) => (
                  <label key={key} style={{ display: 'grid', gap: '8px' }}>
                    <div style={{ fontSize: '14px', color: '#5b5348' }}>{label}</div>
                    <input value={form[key as keyof typeof form] as string} onChange={(e) => updateField(key as keyof typeof form, e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(26,26,24,0.14)', background: '#fff', fontSize: '14px', boxSizing: 'border-box' }} />
                  </label>
                ))}
                <label style={{ display: 'grid', gap: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#5b5348' }}>國家 / 地區</div>
                  <select value={form.country} onChange={(e) => updateField('country', e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(26,26,24,0.14)', background: '#fff', fontSize: '14px', boxSizing: 'border-box' }}>
                    {creatorCountryOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#5b5348' }}>語言（可多揀）</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {creatorLanguageOptions.map((option) => {
                      const selected = form.languages.includes(option)
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleMultiValue('languages', option)}
                          style={{
                            borderRadius: '999px',
                            border: selected ? '1px solid #1a1a18' : '1px solid rgba(26,26,24,0.12)',
                            background: selected ? '#1a1a18' : '#fff',
                            color: selected ? '#f5efe5' : '#1a1a18',
                            padding: '10px 12px',
                            cursor: 'pointer',
                          }}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </section>

            <section style={{ padding: '24px', borderRadius: '24px', background: 'rgba(255,255,255,0.78)', border: '1px solid rgba(26,26,24,0.10)' }}>
              <div style={{ fontSize: '12px', letterSpacing: '0.16em', color: '#8b7c69', marginBottom: '8px' }}>PLATFORM LINKS</div>
              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  ['primaryPlatform', '主要平台'],
                  ['instagramUrl', 'Instagram Link'],
                  ['tiktokUrl', 'TikTok Link'],
                  ['youtubeUrl', 'YouTube Link'],
                  ['threadsUrl', 'Threads Link'],
                  ['xiaohongshuUrl', '小紅書 Link'],
                  ['otherLinks', '其他平台 / Portfolio Links'],
                ].map(([key, label]) => (
                  <label key={key} style={{ display: 'grid', gap: '8px' }}>
                    <div style={{ fontSize: '14px', color: '#5b5348' }}>{label}</div>
                    <input value={form[key as keyof typeof form]} onChange={(e) => updateField(key as keyof typeof form, e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(26,26,24,0.14)', background: '#fff', fontSize: '14px', boxSizing: 'border-box' }} />
                  </label>
                ))}
              </div>
            </section>

            <section style={{ padding: '24px', borderRadius: '24px', background: 'rgba(255,255,255,0.78)', border: '1px solid rgba(26,26,24,0.10)' }}>
              <div style={{ fontSize: '12px', letterSpacing: '0.16em', color: '#8b7c69', marginBottom: '8px' }}>CONTENT + COMMERCIAL INFO</div>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#5b5348' }}>你曾經拍過嘅內容類別（可多揀）</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {creatorContentCategoryOptions.map((option) => {
                      const selected = form.contentCategories.includes(option)
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleMultiValue('contentCategories', option)}
                          style={{
                            borderRadius: '999px',
                            border: selected ? '1px solid #1a1a18' : '1px solid rgba(26,26,24,0.12)',
                            background: selected ? '#1a1a18' : '#fff',
                            color: selected ? '#f5efe5' : '#1a1a18',
                            padding: '10px 12px',
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                          }}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#5b5348' }}>內容形式（可多揀）</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {creatorContentFormatOptions.map((option) => {
                      const selected = form.contentFormats.includes(option)
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleMultiValue('contentFormats', option)}
                          style={{
                            borderRadius: '999px',
                            border: selected ? '1px solid #1a1a18' : '1px solid rgba(26,26,24,0.12)',
                            background: selected ? '#1a1a18' : '#fff',
                            color: selected ? '#f5efe5' : '#1a1a18',
                            padding: '10px 12px',
                            cursor: 'pointer',
                          }}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#5b5348' }}>Audience / 28 日數據摘要 cap 圖 links</div>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    {form.audienceInsightLinks.map((value, index) => (
                      <input
                        key={`audience-link-${index}`}
                        value={value}
                        onChange={(e) => updateListField('audienceInsightLinks', index, e.target.value)}
                        placeholder={`Cap 圖 / Google Drive Link ${index + 1}`}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(26,26,24,0.14)', background: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#5b5348' }}>曾經嘅品牌合作（最近 5 個）</div>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    {form.recentBrandCollabs.map((value, index) => (
                      <input
                        key={`brand-collab-${index}`}
                        value={value}
                        onChange={(e) => updateListField('recentBrandCollabs', index, e.target.value)}
                        placeholder={`品牌合作 ${index + 1}`}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(26,26,24,0.14)', background: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#5b5348' }}>有冇做過帶轉化 / sales campaign？（最近 5 個）</div>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    {form.recentConversionCampaigns.map((value, index) => (
                      <input
                        key={`conversion-campaign-${index}`}
                        value={value}
                        onChange={(e) => updateListField('recentConversionCampaigns', index, e.target.value)}
                        placeholder={`Sales campaign ${index + 1}`}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(26,26,24,0.14)', background: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  {[
                    ['usualReelRate', '一條 Reel 收費'],
                    ['usualPostRate', '一個 Post 收費'],
                    ['usualStoryRate', '一個 Story 收費'],
                  ].map(([key, label]) => (
                    <label key={key} style={{ display: 'grid', gap: '8px' }}>
                      <div style={{ fontSize: '14px', color: '#5b5348' }}>{label}</div>
                      <select
                        value={form[key as 'usualReelRate' | 'usualPostRate' | 'usualStoryRate']}
                        onChange={(e) => updateField(key as keyof typeof defaultCreatorApplyForm, e.target.value)}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(26,26,24,0.14)', background: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
                      >
                        <option value="">請選擇</option>
                        {creatorRateRangeOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>

                <div style={{ display: 'grid', gap: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#5b5348' }}>可接拍攝地區（可多揀）</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {creatorAvailableRegionOptions.map((option) => {
                      const selected = form.availableRegions.includes(option)
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleMultiValue('availableRegions', option)}
                          style={{
                            borderRadius: '999px',
                            border: selected ? '1px solid #1a1a18' : '1px solid rgba(26,26,24,0.12)',
                            background: selected ? '#1a1a18' : '#fff',
                            color: selected ? '#f5efe5' : '#1a1a18',
                            padding: '10px 12px',
                            cursor: 'pointer',
                          }}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <label style={{ display: 'grid', gap: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#5b5348' }}>一般交片時間</div>
                  <input
                    value={form.turnaroundDays}
                    onChange={(e) => updateField('turnaroundDays', e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(26,26,24,0.14)', background: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </label>

                <div style={{ display: 'grid', gap: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#5b5348' }}>最代表你 style 嘅 3 條 content links</div>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    {form.topContentLinks.map((value, index) => (
                      <input
                        key={`top-content-link-${index}`}
                        value={value}
                        onChange={(e) => updateListField('topContentLinks', index, e.target.value)}
                        placeholder={`Content link ${index + 1}`}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(26,26,24,0.14)', background: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section style={{ padding: '24px', borderRadius: '24px', background: '#121212', color: '#f5efe5', border: '1px solid rgba(26,26,24,0.10)' }}>
              <div style={{ fontSize: '12px', letterSpacing: '0.16em', color: '#c7bdaf', marginBottom: '8px' }}>CREATOR PLANS</div>
              <div style={{ fontSize: '38px', lineHeight: 1.05, marginBottom: '10px' }}>揀你想用嘅 SOON Creator 計劃</div>
              <div style={{ fontSize: '17px', lineHeight: 1.7, color: '#e8ddcf', marginBottom: '18px', maxWidth: '760px' }}>
                唔同 level 會影響你可用幾多 internal tools。最基本一定可以安全接 job；之後再按你想用幾多題材庫、script creation、storyboard、AI 生片去揀。
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                {plans.map((plan) => {
                  const selected = form.selectedPlan === plan.id

                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => updateField('selectedPlan', plan.id)}
                      style={{
                        textAlign: 'left',
                        padding: '20px',
                        borderRadius: '24px',
                        border: selected ? '1px solid rgba(255,255,255,0.72)' : '1px solid rgba(255,255,255,0.12)',
                        background: selected ? 'linear-gradient(180deg, rgba(47,64,86,0.92) 0%, rgba(18,18,18,0.96) 100%)' : 'rgba(255,255,255,0.04)',
                        color: '#f5efe5',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                        <div style={{ fontSize: '28px', lineHeight: 1.05 }}>{plan.name}</div>
                        {plan.recommended ? (
                          <span style={{ borderRadius: '999px', background: 'rgba(245,239,229,0.12)', padding: '6px 10px', fontSize: '11px', letterSpacing: '0.12em' }}>
                            RECOMMENDED
                          </span>
                        ) : null}
                      </div>
                      <div style={{ fontSize: '40px', lineHeight: 1, marginBottom: '8px' }}>{plan.monthlyLabel}</div>
                      <div style={{ color: '#d9cfbf', marginBottom: '12px', lineHeight: 1.6 }}>{plan.subtitle}</div>
                      <div style={{ color: '#c7bdaf', lineHeight: 1.7, marginBottom: '14px' }}>{plan.description}</div>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {plan.features.map((feature) => (
                          <div key={feature} style={{ fontSize: '14px', lineHeight: 1.6 }}>
                            ✓ {feature}
                          </div>
                        ))}
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>

            <section style={{ padding: '26px', borderRadius: '24px', background: '#1a1a18', color: '#f5efe5', border: '1px solid rgba(26,26,24,0.10)' }}>
              <div style={{ fontSize: '12px', letterSpacing: '0.16em', color: '#c7bdaf', marginBottom: '10px' }}>NEXT STEP</div>
              <div style={{ fontSize: '34px', lineHeight: 1.08, marginBottom: '12px' }}>提交後，SOON 會用 AI 幫你做第一輪 creator analysis。</div>
              <div style={{ fontSize: '17px', lineHeight: 1.7, color: '#e8ddcf', marginBottom: '18px', maxWidth: '780px' }}>
                第一版我哋會先收集 onboarding form，將資料入庫，再用 AI 生成第一輪 creator snapshot。之後再加 upload、internal review 同 approved creator database。
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isPending}
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '999px', background: '#f5efe5', color: '#1a1a18', padding: '14px 18px', textDecoration: 'none', fontSize: '14px', border: 'none', cursor: 'pointer', opacity: isPending ? 0.72 : 1 }}
                >
                  {isPending ? '提交中...' : '提交申請'}
                </button>
                <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '999px', background: 'transparent', color: '#f5efe5', padding: '14px 18px', textDecoration: 'none', fontSize: '14px', border: '1px solid rgba(245,239,229,0.35)' }}>
                  返回首頁
                </Link>
              </div>
              {submitMessage ? (
                <div style={{ marginTop: '14px', padding: '14px 16px', borderRadius: '16px', background: 'rgba(245,239,229,0.10)', color: '#f5efe5', lineHeight: 1.7 }}>
                  {submitMessage}
                </div>
              ) : null}
              {submitError ? (
                <div style={{ marginTop: '14px', padding: '14px 16px', borderRadius: '16px', background: 'rgba(181,69,69,0.16)', color: '#ffe7e3', lineHeight: 1.7 }}>
                  {submitError}
                </div>
              ) : null}
            </section>
          </div>

          <aside style={{ position: 'sticky', top: '24px' }}>
            <section style={{ padding: '24px', borderRadius: '24px', background: 'rgba(255,255,255,0.72)', border: '1px solid rgba(26,26,24,0.10)' }}>
              <div style={{ fontSize: '12px', letterSpacing: '0.16em', color: '#8b7c69', marginBottom: '10px' }}>AI PREVIEW</div>
              <div style={{ fontSize: '34px', lineHeight: 1.05, color: '#1a1a18', marginBottom: '16px' }}>Creator Snapshot</div>
              {preview ? (
                <div style={{ display: 'grid', gap: '10px' }}>
                  <div style={{ padding: '16px', borderRadius: '18px', background: '#fbf8f1', border: '1px solid rgba(26,26,24,0.08)' }}>
                    <div style={{ fontSize: '12px', color: '#8b7c69', marginBottom: '6px' }}>Suggested Archetype</div>
                    <div style={{ lineHeight: 1.7 }}>{preview.archetype}</div>
                  </div>
                  <div style={{ padding: '16px', borderRadius: '18px', background: '#fbf8f1', border: '1px solid rgba(26,26,24,0.08)' }}>
                    <div style={{ fontSize: '12px', color: '#8b7c69', marginBottom: '6px' }}>Fit Objective</div>
                    <div style={{ lineHeight: 1.7 }}>{preview.fitObjective}</div>
                  </div>
                  <div style={{ padding: '16px', borderRadius: '18px', background: '#fbf8f1', border: '1px solid rgba(26,26,24,0.08)' }}>
                    <div style={{ fontSize: '12px', color: '#8b7c69', marginBottom: '6px' }}>Strength Summary</div>
                    <div style={{ lineHeight: 1.7 }}>{preview.strength}</div>
                  </div>
                  <div style={{ padding: '16px', borderRadius: '18px', background: '#fbf8f1', border: '1px solid rgba(26,26,24,0.08)' }}>
                    <div style={{ fontSize: '12px', color: '#8b7c69', marginBottom: '6px' }}>AI Fit Summary</div>
                    <div style={{ lineHeight: 1.7 }}>{preview.fitSummary}</div>
                  </div>
                  <div style={{ padding: '16px', borderRadius: '18px', background: '#fbf8f1', border: '1px solid rgba(26,26,24,0.08)' }}>
                    <div style={{ fontSize: '12px', color: '#8b7c69', marginBottom: '6px' }}>Selected Plan</div>
                    <div style={{ lineHeight: 1.7 }}>{preview.selectedPlanSummary}</div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '16px', borderRadius: '18px', background: '#fbf8f1', border: '1px solid rgba(26,26,24,0.08)', lineHeight: 1.7, color: '#5b5348' }}>
                  填完 creator name、內容類型同平台資料之後，右邊就會開始出第一輪 AI creator snapshot。揀咗付費 plan 後，提交申請會直接帶你去 Stripe。
                </div>
              )}
            </section>
          </aside>
        </section>
      </div>
    </main>
  )
}
