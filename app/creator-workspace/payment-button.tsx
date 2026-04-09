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
          throw new Error('未收到付款連結。')
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
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '54px',
          width: 'fit-content',
          borderRadius: '999px',
          background: 'linear-gradient(135deg, #1c72ff, #3d8bff)',
          color: '#ffffff',
          padding: '0 20px',
          border: '1px solid rgba(142,180,255,0.24)',
          cursor: 'pointer',
          opacity: isPending ? 0.72 : 1,
          boxShadow: '0 0 0 1px rgba(142,180,255,0.16), 0 0 28px rgba(27,114,255,0.32)',
        }}
      >
        {isPending ? '前往付款中...' : '立即完成付款'}
      </button>
      {error ? (
        <div style={{ padding: '12px 14px', borderRadius: '14px', background: 'rgba(181,69,69,0.16)', border: '1px solid rgba(255,255,255,0.06)', color: '#ffe7e3', lineHeight: 1.7 }}>
          {error}
        </div>
      ) : null}
    </div>
  )
}
