'use client'

import { createClient } from '@/lib/supabase'

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
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F2EC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, Times New Roman, serif' }}>
      <div style={{ textAlign: 'center', maxWidth: '420px', padding: '48px' }}>
        <p style={{ fontSize: '13px', letterSpacing: '0.15em', color: '#888', marginBottom: '8px' }}>
          SOON · Creator Network
        </p>
        <h1 style={{ fontSize: '34px', fontWeight: '400', color: '#1a1a1a', marginBottom: '18px' }}>
          Creator Login
        </h1>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '40px', fontStyle: 'italic' }}>
          Safe jobs, AI tools, and creator growth
        </p>

        <button
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            padding: '14px 24px',
            border: '1px solid #1a1a1a',
            backgroundColor: 'transparent',
            color: '#1a1a1a',
            fontSize: '15px',
            fontFamily: 'Georgia, Times New Roman, serif',
            cursor: 'pointer',
            letterSpacing: '0.05em',
          }}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  )
}
