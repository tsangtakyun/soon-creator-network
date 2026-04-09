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
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          minHeight: '56px',
          borderRadius: '999px',
          background: 'linear-gradient(135deg, #1c72ff, #3d8bff)',
          color: '#ffffff',
          padding: '0 18px',
          textDecoration: 'none',
          border: '1px solid rgba(142,180,255,0.24)',
          cursor: 'pointer',
          fontSize: '15px',
          boxShadow: '0 0 0 1px rgba(142,180,255,0.16), 0 0 28px rgba(27,114,255,0.32)',
          opacity: isPending ? 0.72 : 1,
        }}
      >
        {isPending ? '正在啟動工具...' : `確認使用並扣除 ${creditCost} 點`}
      </button>
      {error ? (
        <div style={{ padding: '12px 14px', borderRadius: '14px', background: 'rgba(181,69,69,0.16)', border: '1px solid rgba(255,255,255,0.06)', color: '#ffe7e3', lineHeight: 1.7 }}>
          {error}
        </div>
      ) : null}
    </div>
  )
}
