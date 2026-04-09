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

const shellStyle = {
  minHeight: '100vh',
  padding: '40px 24px 100px',
  color: '#f7f8fb',
} as const

const containerStyle = {
  maxWidth: '1240px',
  margin: '0 auto',
  display: 'grid',
  gap: '22px',
} as const

const cardStyle = {
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '30px',
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'linear-gradient(180deg, rgba(13,15,21,0.92), rgba(7,8,12,0.94))',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 28px 80px rgba(0,0,0,0.36)',
} as const

const sectionTitleStyle = {
  fontSize: '12px',
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  color: 'rgba(162, 178, 214, 0.8)',
  marginBottom: '10px',
} as const

const labelStyle = {
  fontSize: '14px',
  color: 'rgba(228,233,245,0.86)',
  letterSpacing: '-0.02em',
} as const

const inputBaseStyle = {
  width: '100%',
  minHeight: '52px',
  padding: '0 16px',
  borderRadius: '16px',
  border: '1px solid rgba(255,255,255,0.10)',
  background: 'rgba(255,255,255,0.04)',
  color: '#f7f8fb',
  fontSize: '15px',
  boxSizing: 'border-box' as const,
  outline: 'none',
} as const

const pillButtonBase = {
  borderRadius: '999px',
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.03)',
  color: 'rgba(244,247,255,0.88)',
  padding: '10px 14px',
  cursor: 'pointer',
  fontSize: '14px',
  lineHeight: 1,
} as const

const primaryButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '56px',
  padding: '0 24px',
  borderRadius: '999px',
  border: '1px solid rgba(142,180,255,0.24)',
  background: 'linear-gradient(135deg, #1c72ff, #3d8bff)',
  color: '#ffffff',
  textDecoration: 'none',
  cursor: 'pointer',
  fontSize: '15px',
  boxShadow: '0 0 0 1px rgba(142,180,255,0.16), 0 0 32px rgba(27,114,255,0.35)',
} as const

const secondaryButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '56px',
  padding: '0 24px',
  borderRadius: '999px',
  border: '1px solid rgba(255,255,255,0.14)',
  background: 'rgba(255,255,255,0.05)',
  color: '#f4f7ff',
  textDecoration: 'none',
  cursor: 'pointer',
  fontSize: '15px',
} as const

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
    setSubmitMessage('正在整理創作者申請資料...')

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

          setSubmitMessage('即將跳轉至 Stripe 付款頁面...')
          window.location.href = checkoutResult.url
          return
        }

        setSubmitMessage('已收到申請，正在前往確認頁面...')
        router.push(`/thank-you?id=${result.id}`)
      } catch (error) {
        setSubmitMessage('')
        setSubmitError(error instanceof Error ? error.message : '提交申請失敗，請稍後再試。')
      }
    })
  }

  return (
    <main style={shellStyle}>
      <div style={containerStyle}>
        <section style={{ ...cardStyle, padding: '40px' }}>
          <div style={sectionTitleStyle}>創作者申請</div>
          <h1
            style={{
              margin: '0 0 14px',
              fontSize: 'clamp(2.6rem, 5vw, 4.5rem)',
              lineHeight: 0.96,
              letterSpacing: '-0.07em',
              fontWeight: 350,
            }}
          >
            申請加入 SOON Creator Network
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: '900px',
              color: 'rgba(210,217,234,0.8)',
              fontSize: '18px',
              lineHeight: 1.8,
            }}
          >
            第一版會先收集你的基本資料、平台連結、內容方向與近期數據資料。提交後，SOON 會先建立第一輪創作者分析，並按方案安排後續工作流程。
          </p>
        </section>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.04fr) 360px',
            gap: '22px',
            alignItems: 'start',
          }}
        >
          <div style={{ display: 'grid', gap: '18px' }}>
            <section style={{ ...cardStyle, padding: '24px' }}>
              <div style={sectionTitleStyle}>基本資料</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {[
                  ['creatorName', '創作者名稱'],
                  ['contactName', '聯絡人姓名'],
                  ['email', '電子郵件'],
                  ['whatsapp', 'WhatsApp'],
                ].map(([key, label]) => (
                  <label key={key} style={{ display: 'grid', gap: '8px' }}>
                    <div style={labelStyle}>{label}</div>
                    <input
                      value={form[key as keyof typeof form] as string}
                      onChange={(e) => updateField(key as keyof typeof form, e.target.value)}
                      style={inputBaseStyle}
                    />
                  </label>
                ))}

                <label style={{ display: 'grid', gap: '8px' }}>
                  <div style={labelStyle}>國家／地區</div>
                  <select
                    value={form.country}
                    onChange={(e) => updateField('country', e.target.value)}
                    style={inputBaseStyle}
                  >
                    {creatorCountryOptions.map((option) => (
                      <option key={option} value={option} style={{ color: '#111' }}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <div style={{ display: 'grid', gap: '8px' }}>
                  <div style={labelStyle}>語言（可多選）</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {creatorLanguageOptions.map((option) => {
                      const selected = form.languages.includes(option)
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleMultiValue('languages', option)}
                          style={{
                            ...pillButtonBase,
                            background: selected ? 'linear-gradient(135deg, #1c72ff, #3d8bff)' : pillButtonBase.background,
                            color: selected ? '#fff' : pillButtonBase.color,
                            border: selected ? '1px solid rgba(142,180,255,0.28)' : pillButtonBase.border,
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

            <section style={{ ...cardStyle, padding: '24px' }}>
              <div style={sectionTitleStyle}>平台連結</div>
              <div style={{ display: 'grid', gap: '12px' }}>
                <label style={{ display: 'grid', gap: '8px' }}>
                  <div style={labelStyle}>主要平台</div>
                  <input
                    value={form.primaryPlatform}
                    onChange={(e) => updateField('primaryPlatform', e.target.value)}
                    style={inputBaseStyle}
                  />
                </label>
                {[
                  ['instagramUrl', 'Instagram 連結'],
                  ['tiktokUrl', 'TikTok 連結'],
                  ['youtubeUrl', 'YouTube 連結'],
                  ['threadsUrl', 'Threads 連結'],
                  ['xiaohongshuUrl', '小紅書連結'],
                  ['otherLinks', '其他平台／作品集連結'],
                ].map(([key, label]) => (
                  <label key={key} style={{ display: 'grid', gap: '8px' }}>
                    <div style={labelStyle}>{label}</div>
                    <input
                      value={form[key as keyof typeof form]}
                      onChange={(e) => updateField(key as keyof typeof form, e.target.value)}
                      style={inputBaseStyle}
                    />
                  </label>
                ))}
              </div>
            </section>

            <section style={{ ...cardStyle, padding: '24px' }}>
              <div style={sectionTitleStyle}>內容與商務資料</div>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <div style={labelStyle}>內容類別（可多選）</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {creatorContentCategoryOptions.map((option) => {
                      const selected = form.contentCategories.includes(option)
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleMultiValue('contentCategories', option)}
                          style={{
                            ...pillButtonBase,
                            textTransform: 'capitalize',
                            background: selected ? 'linear-gradient(135deg, #1c72ff, #3d8bff)' : pillButtonBase.background,
                            color: selected ? '#fff' : pillButtonBase.color,
                            border: selected ? '1px solid rgba(142,180,255,0.28)' : pillButtonBase.border,
                          }}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '8px' }}>
                  <div style={labelStyle}>內容形式（可多選）</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {creatorContentFormatOptions.map((option) => {
                      const selected = form.contentFormats.includes(option)
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleMultiValue('contentFormats', option)}
                          style={{
                            ...pillButtonBase,
                            background: selected ? 'linear-gradient(135deg, #1c72ff, #3d8bff)' : pillButtonBase.background,
                            color: selected ? '#fff' : pillButtonBase.color,
                            border: selected ? '1px solid rgba(142,180,255,0.28)' : pillButtonBase.border,
                          }}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <ListInputGroup
                  label="Audience／最近 28 日數據摘要連結"
                  values={form.audienceInsightLinks}
                  placeholderPrefix="數據資料連結"
                  onChange={(index, value) => updateListField('audienceInsightLinks', index, value)}
                />

                <ListInputGroup
                  label="最近 5 個品牌合作"
                  values={form.recentBrandCollabs}
                  placeholderPrefix="品牌合作"
                  onChange={(index, value) => updateListField('recentBrandCollabs', index, value)}
                />

                <ListInputGroup
                  label="最近 5 個帶轉化合作"
                  values={form.recentConversionCampaigns}
                  placeholderPrefix="轉化合作"
                  onChange={(index, value) => updateListField('recentConversionCampaigns', index, value)}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  {[
                    ['usualReelRate', '一條 Reel 收費'],
                    ['usualPostRate', '一則 Post 收費'],
                    ['usualStoryRate', '一則 Story 收費'],
                  ].map(([key, label]) => (
                    <label key={key} style={{ display: 'grid', gap: '8px' }}>
                      <div style={labelStyle}>{label}</div>
                      <select
                        value={form[key as 'usualReelRate' | 'usualPostRate' | 'usualStoryRate']}
                        onChange={(e) => updateField(key as keyof typeof defaultCreatorApplyForm, e.target.value)}
                        style={inputBaseStyle}
                      >
                        <option value="" style={{ color: '#111' }}>請選擇</option>
                        {creatorRateRangeOptions.map((option) => (
                          <option key={option} value={option} style={{ color: '#111' }}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>

                <div style={{ display: 'grid', gap: '8px' }}>
                  <div style={labelStyle}>可接拍攝地區（可多選）</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {creatorAvailableRegionOptions.map((option) => {
                      const selected = form.availableRegions.includes(option)
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleMultiValue('availableRegions', option)}
                          style={{
                            ...pillButtonBase,
                            background: selected ? 'linear-gradient(135deg, #1c72ff, #3d8bff)' : pillButtonBase.background,
                            color: selected ? '#fff' : pillButtonBase.color,
                            border: selected ? '1px solid rgba(142,180,255,0.28)' : pillButtonBase.border,
                          }}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <label style={{ display: 'grid', gap: '8px' }}>
                  <div style={labelStyle}>一般交付時間</div>
                  <input
                    value={form.turnaroundDays}
                    onChange={(e) => updateField('turnaroundDays', e.target.value)}
                    style={inputBaseStyle}
                  />
                </label>

                <ListInputGroup
                  label="最能代表你風格的 3 條內容連結"
                  values={form.topContentLinks}
                  placeholderPrefix="作品連結"
                  onChange={(index, value) => updateListField('topContentLinks', index, value)}
                />
              </div>
            </section>

            <section style={{ ...cardStyle, padding: '24px' }}>
              <div style={sectionTitleStyle}>創作者方案</div>
              <div style={{ fontSize: '36px', lineHeight: 1.04, marginBottom: '10px', fontWeight: 350 }}>
                選擇適合你的 SOON 方案
              </div>
              <div style={{ fontSize: '16px', lineHeight: 1.8, color: 'rgba(216,221,235,0.76)', marginBottom: '18px' }}>
                基本方案可先安全接案；如需更多題材研究、腳本與分鏡工作流程，則可按使用程度升級。
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
                        border: selected ? '1px solid rgba(142,180,255,0.34)' : '1px solid rgba(255,255,255,0.12)',
                        background: selected
                          ? 'linear-gradient(180deg, rgba(19,45,92,0.92) 0%, rgba(13,15,21,0.98) 100%)'
                          : 'rgba(255,255,255,0.04)',
                        color: '#f5efe5',
                        cursor: 'pointer',
                        boxShadow: selected ? '0 0 0 1px rgba(142,180,255,0.12), 0 20px 44px rgba(7,25,69,0.35)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                        <div style={{ fontSize: '28px', lineHeight: 1.05 }}>{plan.name}</div>
                        {plan.recommended ? (
                          <span style={{ borderRadius: '999px', background: 'rgba(61,141,255,0.14)', padding: '6px 10px', fontSize: '11px', letterSpacing: '0.12em', color: '#9ec2ff' }}>
                            建議選擇
                          </span>
                        ) : null}
                      </div>
                      <div style={{ fontSize: '40px', lineHeight: 1, marginBottom: '8px' }}>{plan.monthlyLabel}</div>
                      <div style={{ color: 'rgba(216,221,235,0.76)', marginBottom: '12px', lineHeight: 1.6 }}>{plan.subtitle}</div>
                      <div style={{ color: 'rgba(199,206,223,0.72)', lineHeight: 1.7, marginBottom: '14px' }}>{plan.description}</div>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {plan.features.map((feature) => (
                          <div key={feature} style={{ fontSize: '14px', lineHeight: 1.6 }}>
                            • {feature}
                          </div>
                        ))}
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>

            <section style={{ ...cardStyle, padding: '26px' }}>
              <div style={sectionTitleStyle}>下一步</div>
              <div style={{ fontSize: '34px', lineHeight: 1.08, marginBottom: '12px', fontWeight: 350 }}>
                提交後，SOON 會先建立第一輪創作者分析。
              </div>
              <div style={{ fontSize: '17px', lineHeight: 1.8, color: 'rgba(216,221,235,0.76)', marginBottom: '18px', maxWidth: '780px' }}>
                系統會先整理你的 onboarding 資料，再建立創作者快照；如已選擇付費方案，提交後會直接前往 Stripe 付款流程。
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isPending}
                  style={{ ...primaryButtonStyle, border: 'none', opacity: isPending ? 0.72 : 1 }}
                >
                  {isPending ? '提交中...' : '提交申請'}
                </button>
                <Link href="/" style={secondaryButtonStyle}>
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
            <section style={{ ...cardStyle, padding: '24px' }}>
              <div style={sectionTitleStyle}>AI 預覽</div>
              <div style={{ fontSize: '34px', lineHeight: 1.05, marginBottom: '16px', fontWeight: 350 }}>創作者快照</div>
              {preview ? (
                <div style={{ display: 'grid', gap: '10px' }}>
                  {[
                    ['建議類型', preview.archetype],
                    ['適合目標', preview.fitObjective],
                    ['優勢摘要', preview.strength],
                    ['AI 配對判斷', preview.fitSummary],
                    ['已選方案', preview.selectedPlanSummary],
                  ].map(([title, value]) => (
                    <div key={title} style={{ padding: '16px', borderRadius: '18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontSize: '12px', color: 'rgba(162,178,214,0.82)', marginBottom: '6px', letterSpacing: '0.08em' }}>{title}</div>
                      <div style={{ lineHeight: 1.7, color: '#eef2ff' }}>{value}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '16px', borderRadius: '18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', lineHeight: 1.8, color: 'rgba(216,221,235,0.76)' }}>
                  當你填寫創作者名稱、內容類別與平台資訊後，右側便會開始顯示第一輪 AI 創作者快照。
                </div>
              )}
            </section>
          </aside>
        </section>
      </div>
    </main>
  )
}

function ListInputGroup({
  label,
  values,
  placeholderPrefix,
  onChange,
}: {
  label: string
  values: string[]
  placeholderPrefix: string
  onChange: (index: number, value: string) => void
}) {
  return (
    <div style={{ display: 'grid', gap: '8px' }}>
      <div style={labelStyle}>{label}</div>
      <div style={{ display: 'grid', gap: '10px' }}>
        {values.map((value, index) => (
          <input
            key={`${placeholderPrefix}-${index}`}
            value={value}
            onChange={(e) => onChange(index, e.target.value)}
            placeholder={`${placeholderPrefix} ${index + 1}`}
            style={inputBaseStyle}
          />
        ))}
      </div>
    </div>
  )
}
