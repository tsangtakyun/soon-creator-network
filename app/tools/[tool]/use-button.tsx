'use client'

import { useState, useTransition } from 'react'

type CreatorToolUseButtonProps = {
  toolSlug: string
  creditCost: number
}

export default function CreatorToolUseButton({
  toolSlug,
  creditCost,
}: CreatorToolUseButtonProps) {
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleUseTool() {
    setError('')

    startTransition(async () => {
      try {
        const response = await fetch('/api/tools/use', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            toolSlug,
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || '未能開始工具流程。')
        }

        if (!result.url) {
          throw new Error('未收到工具入口網址。')
        }

        window.open(result.url, '_blank', 'noopener,noreferrer')
      } catch (useError) {
        setError(useError instanceof Error ? useError.message : '未能開始工具流程。')
      }
    })
  }

  return (
    <div style={{ display: 'grid', gap: '12px' }}>
      <button
        type="button"
        onClick={handleUseTool}
        disabled={isPending}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '999px', background: '#f5efe5', color: '#1a1a18', padding: '12px 16px', textDecoration: 'none', border: 'none', cursor: 'pointer' }}
      >
        {isPending ? '扣 credit 中...' : `確認使用並扣 ${creditCost} credits`}
      </button>
      {error ? (
        <div style={{ padding: '12px 14px', borderRadius: '14px', background: 'rgba(255,255,255,0.08)', color: '#f5d7cf', lineHeight: 1.7 }}>
          {error}
        </div>
      ) : null}
    </div>
  )
}
