import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SOON Creator Network',
  description: 'Join SOON Creator Network to access safer jobs, creator tools, and AI campaign matching.',
}

function NavBar() {
  return (
    <>
      <nav className="site-nav">
        <Link href="/" className="brand-mark">
          <img src="/soon-logo-white.png" alt="SOON" className="brand-logo" />
          <span>Creator</span>
        </Link>

        <div className="nav-links">
          <a href="/#why-soon">Why SOON</a>
          <a href="/#plans">Plans</a>
          <Link href="/apply">Apply</Link>
          <Link href="/creator-workspace">Workspace</Link>
        </div>

        <div className="nav-actions">
          <Link href="/creator-workspace" className="nav-secondary">
            Go to Dashboard
          </Link>
          <Link href="/apply" className="nav-primary">
            Join Network
          </Link>
        </div>
      </nav>

      <style dangerouslySetInnerHTML={{ __html: `
        .site-nav {
          position: sticky;
          top: 18px;
          z-index: 1000;
          width: min(1240px, calc(100% - 32px));
          margin: 18px auto 0;
          padding: 14px 18px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background:
            linear-gradient(180deg, rgba(15, 18, 24, 0.92), rgba(7, 8, 11, 0.92));
          box-shadow:
            0 18px 60px rgba(0, 0, 0, 0.45),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(18px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .brand-mark {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #f6f7fb;
          text-decoration: none;
          font-size: 0.96rem;
          font-weight: 500;
          letter-spacing: -0.04em;
          white-space: nowrap;
        }

        .brand-logo {
          width: 48px;
          height: auto;
          display: block;
          object-fit: contain;
        }

        .nav-links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          flex: 1;
          flex-wrap: wrap;
        }

        .nav-links a {
          color: rgba(233, 236, 245, 0.8);
          text-decoration: none;
          font-size: 0.92rem;
          font-weight: 400;
          letter-spacing: -0.03em;
          transition: color 160ms ease;
        }

        .nav-links a:hover {
          color: #ffffff;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .nav-secondary,
        .nav-primary {
          text-decoration: none;
          border-radius: 999px;
          padding: 11px 18px;
          font-size: 0.92rem;
          font-weight: 400;
          letter-spacing: -0.03em;
          white-space: nowrap;
        }

        .nav-secondary {
          color: rgba(239, 243, 255, 0.88);
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.03);
        }

        .nav-primary {
          color: #ffffff;
          background: linear-gradient(135deg, #2d76ff, #4c8dff);
          box-shadow:
            0 0 0 1px rgba(136, 174, 255, 0.22),
            0 0 30px rgba(45, 118, 255, 0.45);
        }

        @media (max-width: 980px) {
          .site-nav {
            border-radius: 28px;
            padding: 16px;
            top: 12px;
            flex-direction: column;
            align-items: stretch;
          }

          .nav-links {
            justify-content: flex-start;
          }

          .nav-actions {
            justify-content: stretch;
          }

          .nav-secondary,
          .nav-primary {
            flex: 1;
            text-align: center;
          }
        }

        @media (max-width: 640px) {
          .site-nav {
            width: min(100% - 20px, 1240px);
          }

          .nav-links {
            gap: 10px 14px;
          }

          .nav-links a {
            font-size: 0.88rem;
          }
        }
      ` }} />
    </>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-HK">
      <body>
        <NavBar />
        {children}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            color-scheme: dark;
          }

          * {
            box-sizing: border-box;
          }

          html {
            scroll-behavior: smooth;
          }

          body {
            margin: 0;
            min-height: 100vh;
            font-family:
              "SF Pro Rounded", "SF Pro Display", "Avenir Next", ui-rounded,
              "Nunito Sans", system-ui, -apple-system, BlinkMacSystemFont,
              "Segoe UI", sans-serif;
            background:
              radial-gradient(circle at top, rgba(41, 98, 255, 0.22), transparent 28%),
              linear-gradient(180deg, #040507 0%, #06080c 36%, #050608 100%);
            color: #f7f8fb;
          }

          body::before {
            content: "";
            position: fixed;
            inset: 0;
            pointer-events: none;
            background-image:
              linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
            background-size: 48px 48px;
            mask-image: radial-gradient(circle at center, black, transparent 84%);
            opacity: 0.2;
          }

          a {
            color: inherit;
          }
        ` }} />
      </body>
    </html>
  )
}
