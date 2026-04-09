'use client'

import { useState, useTransition } from 'react'

type CreatorPlanPaymentButtonProps = {
  applicationId: string
  email: string
  selectedPlan: string
}

export default function CreatorPlanPaymentButton({
  applicationId,
  email,
  selectedPlan,
}: CreatorPlanPaymentButtonProps) {
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleCheckout() {
    setError('')

    startTransition(async () => {
      try {
        const response = await fetch('/api/creator-plan/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            applicationId,
            email,
            selectedPlan,
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || '未能建立付款流程。')
        }

        if (!result.url) {
          throw new Error('未收到 Stripe checkout URL。')
        }

        window.location.href = result.url
      } catch (paymentError) {
        setError(paymentError instanceof Error ? paymentError.message : '未能建立付款流程。')
      }
    })
  }

  return (
    <div style={{ display: 'grid', gap: '12px' }}>
      <button
        type="button"
        onClick={handleCheckout}
        disabled={isPending}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '999px', background: '#1a1a18', color: '#f5efe5', padding: '12px 16px', border: 'none', cursor: 'pointer', width: 'fit-content', opacity: isPending ? 0.72 : 1 }}
      >
        {isPending ? '前往付款中...' : '立即完成 Stripe 付款'}
      </button>
      {error ? (
        <div style={{ padding: '12px 14px', borderRadius: '14px', background: '#fbf1ef', border: '1px solid rgba(26,26,24,0.08)', color: '#7d493f', lineHeight: 1.7 }}>
          {error}
        </div>
      ) : null}
    </div>
  )
}
