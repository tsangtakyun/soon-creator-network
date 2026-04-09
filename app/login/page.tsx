'use client'

import { createClient } from '@/lib/supabase'

const pageStyle = {
  minHeight: 'calc(100vh - 120px)',
  display: 'grid',
  placeItems: 'center',
  padding: '40px 24px 96px',
} as const

const cardStyle = {
  width: 'min(100%, 560px)',
  padding: '40px 32px',
  borderRadius: '32px',
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'linear-gradient(180deg, rgba(13,15,21,0.92), rgba(7,8,12,0.94))',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 28px 80px rgba(0,0,0,0.36)',
  textAlign: 'center' as const,
} as const

const eyebrowStyle = {
  margin: '0 0 10px',
  fontSize: '12px',
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  color: 'rgba(162,178,214,0.8)',
} as const

const primaryButtonStyle = {
  width: '100%',
  minHeight: '56px',
  padding: '0 22px',
  borderRadius: '999px',
  border: '1px solid rgba(142,180,255,0.24)',
  background: 'linear-gradient(135deg, #1c72ff, #3d8bff)',
  color: '#ffffff',
  fontSize: '15px',
  fontFamily:
    '"SF Pro Rounded", "SF Pro Display", "Avenir Next", ui-rounded, "Nunito Sans", system-ui, sans-serif',
  cursor: 'pointer',
  boxShadow: '0 0 0 1px rgba(142,180,255,0.16), 0 0 28px rgba(27,114,255,0.32)',
} as const

export default function LoginPage() {
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <p style={eyebrowStyle}>SOON Creator Network</p>
        <h1
          style={{
            margin: '0 0 14px',
            fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
            lineHeight: 0.96,
            letterSpacing: '-0.06em',
            fontWeight: 350,
          }}
        >
          登入創作者工作台
        </h1>
        <p
          style={{
            margin: '0 auto 28px',
            maxWidth: '420px',
            fontSize: '16px',
            lineHeight: 1.8,
            color: 'rgba(210,217,234,0.78)',
          }}
        >
          以 Google 帳戶登入，即可查看合作狀態、方案權限與 SOON 創作工具入口。
        </p>

        <button onClick={handleGoogleLogin} style={primaryButtonStyle}>
          使用 Google 登入
        </button>
      </section>
    </main>
  )
}
