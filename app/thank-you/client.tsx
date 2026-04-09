'use client'

import { useEffect, useState } from 'react'

type ThankYouClientProps = {
  applicationId?: string
  payment?: string
  plan?: string
  sessionId?: string
}

export default function ThankYouClient({
  applicationId,
  payment,
  plan,
  sessionId,
}: ThankYouClientProps) {
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    if (payment !== 'success' || !sessionId || !applicationId) return

    let cancelled = false

    async function completePayment() {
      try {
        setStatusMessage('正在確認你嘅 creator plan 付款...')
        const response = await fetch('/api/creator-plan/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            applicationId,
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || '未能確認付款。')
        }

        if (!cancelled) {
          setStatusMessage(plan ? `已確認 ${plan} 付款，你嘅 creator onboarding 已正式啟動。` : '已確認付款。')
        }
      } catch (error) {
        if (!cancelled) {
          setStatusMessage(error instanceof Error ? error.message : '未能確認付款。')
        }
      }
    }

    void completePayment()

    return () => {
      cancelled = true
    }
  }, [applicationId, payment, plan, sessionId])

  if (!statusMessage) return null

  return (
    <div style={{ margin: '0 0 18px', padding: '14px 16px', borderRadius: '16px', background: '#fbf8f1', border: '1px solid rgba(26,26,24,0.08)', lineHeight: 1.7, color: '#5b5348' }}>
      {statusMessage}
    </div>
  )
}
