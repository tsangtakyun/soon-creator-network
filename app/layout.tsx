import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SOON Creator Network',
  description: 'Join SOON Creator Network to access safer jobs, creator tools, and AI campaign matching.',
}

function NavBar() {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: '#F5F2EC',
      borderBottom: '1px solid #e0ddd6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      height: '54px',
      fontFamily: 'Georgia, Times New Roman, serif',
    }}>
      <Link href="/" style={{ fontSize: '13px', letterSpacing: '0.16em', color: '#888', textDecoration: 'none' }}>
        SOON CREATOR
      </Link>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Link href="/apply" style={{ fontSize: '13px', color: '#1a1a1a', textDecoration: 'none', padding: '6px 14px', borderBottom: '1px solid #1a1a1a', letterSpacing: '0.03em' }}>
          Apply Now
        </Link>
        <Link href="/internal/review" style={{ fontSize: '13px', color: '#1a1a1a', textDecoration: 'none', padding: '6px 14px', borderBottom: '1px solid #1a1a1a', letterSpacing: '0.03em' }}>
          Internal Review
        </Link>
        <Link href="/internal/database" style={{ fontSize: '13px', color: '#1a1a1a', textDecoration: 'none', padding: '6px 14px', borderBottom: '1px solid #1a1a1a', letterSpacing: '0.03em' }}>
          Approved Database
        </Link>
        <Link href="/login" style={{ fontSize: '13px', color: '#1a1a1a', textDecoration: 'none', padding: '6px 14px', borderBottom: '1px solid #1a1a1a', letterSpacing: '0.03em' }}>
          Google Login
        </Link>
      </div>
    </nav>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-HK">
      <body style={{ margin: 0, padding: 0, paddingTop: '54px', background: '#f5f0e6' }}>
        <NavBar />
        {children}
      </body>
    </html>
  )
}
