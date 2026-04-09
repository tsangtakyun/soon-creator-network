'use client'

import Link from 'next/link'

import { buildCreatorValueProps, getCreatorPlans } from '@/lib/creator-network'

const creatorSteps = [
  'Apply once and enter the SOON creator pool',
  'Get matched to campaigns with clearer fit and rate context',
  'Unlock idea, script, and storyboard workflows when you want to scale',
]

const featureCards = [
  {
    title: 'Paid-first workflow',
    body: '所有合作先經 SOON system 跑。客戶先付款，creator 先正式入 production flow，減低拖數同溝通失控風險。',
  },
  {
    title: 'AI tools when needed',
    body: '唔係逼你用工具，而係當你想加速搵題材、拆腳本、做 storyboard planning 時，SOON 先俾你即開即用。',
  },
  {
    title: 'Stay independent',
    body: '你可以自由決定接唔接 campaign、揀唔揀 plan、用唔用系統。SOON 係幫你放大能力，唔係收走控制權。',
  },
]

export default function HomePage() {
  const valueProps = buildCreatorValueProps()
  const plans = getCreatorPlans()

  return (
    <>
      <main className="creator-home">
        <section className="hero-shell">
          <section className="hero-copy">
            <div className="eyebrow">SOON CREATOR NETWORK</div>
            <div className="pill-badge">
              <span className="pill-badge__new">NEW</span>
              <span>Creator jobs + AI workflow in one network</span>
            </div>

            <h1>
              <span className="headline-top">人人都可以做</span>
              <span className="headline-bottom">Content Creator</span>
            </h1>

            <p className="hero-text">
              加入 SOON Creator Network，安全接 job、唔怕拖數，仲可以按你需要解鎖題材、script、
              storyboard 呢套 AI workflow，將創作變成更穩定嘅成長系統。
            </p>

            <div className="hero-actions">
              <Link href="/apply" className="primary-cta">
                立即加入 Network
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/creator-workspace" className="secondary-cta">
                Go to Dashboard
              </Link>
            </div>

            <div className="hero-foot">
              <div className="hero-proof">
                <span className="hero-proof__title">Built for creator safety</span>
                <span className="hero-proof__text">
                  Job flow、tool access、workspace update 都由同一個 SOON system 承接。
                </span>
              </div>
              <div className="hero-proof hero-proof--compact">
                <span className="hero-proof__title">Flexible plans</span>
                <span className="hero-proof__text">由 free pool 到 heavy AI workflow，都可以按你節奏升級。</span>
              </div>
            </div>
          </section>
        </section>

        <section className="section-grid">
          <div className="why-shell" id="why-soon">
            <div className="section-heading section-heading--center">
              <div className="eyebrow">WHY SOON</div>
              <h2>唔止係 creator database，而係一個可擴張嘅創作工作台。</h2>
            </div>

            <div className="panel-list">
              {valueProps.map((item, index) => (
                <div key={item} className="panel-item">
                  <span className="panel-index">0{index + 1}</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-grid">
          <div className="section-heading">
            <div className="eyebrow">HOW IT WORKS</div>
            <h2>由接 job 到 content workflow，全部用一條清晰路徑連起。</h2>
          </div>

          <div className="steps-grid">
            {creatorSteps.map((step, index) => (
              <div key={step} className="step-card">
                <div className="step-number">0{index + 1}</div>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section-grid">
          <div className="feature-grid">
            {featureCards.map((card) => (
              <section key={card.title} className="feature-card">
                <div className="feature-card__title">{card.title}</div>
                <p>{card.body}</p>
              </section>
            ))}
          </div>
        </section>

        <section className="plans-shell" id="plans">
          <div className="section-heading section-heading--wide">
            <div className="eyebrow">CREATOR PLANS</div>
            <h2>先入 network，再按你想唔想加速創作 workflow 去揀 plan。</h2>
          </div>

          <div className="plans-grid">
            {plans.map((plan) => (
              <section key={plan.id} className={`plan-card${plan.recommended ? ' plan-card--recommended' : ''}`}>
                <div className="plan-top">
                  <div>
                    <div className="plan-name">{plan.name}</div>
                    <div className="plan-subtitle">{plan.subtitle}</div>
                  </div>
                  {plan.recommended ? <span className="plan-badge">Most Popular</span> : null}
                </div>

                <div className="plan-price">{plan.monthlyLabel}</div>
                <p className="plan-description">{plan.description}</p>

                <div className="plan-features">
                  {plan.features.map((feature) => (
                    <div key={feature} className="plan-feature">
                      <span className="plan-feature__dot" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href="/apply" className={plan.recommended ? 'plan-cta plan-cta--primary' : 'plan-cta'}>
                  {plan.id === 'creator-core' ? '先免費加入' : '揀呢個 plan'}
                </Link>
              </section>
            ))}
          </div>
        </section>
      </main>

      <style jsx>{`
        .creator-home {
          position: relative;
          padding: 28px 24px 110px;
        }

        .hero-shell,
        .section-grid,
        .plans-shell {
          width: min(1240px, 100%);
          margin: 0 auto;
        }

        .hero-shell {
          padding-top: 52px;
        }

        .hero-copy,
        .why-shell,
        .step-card,
        .feature-card,
        .plan-card {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background:
            linear-gradient(180deg, rgba(13, 15, 21, 0.92), rgba(7, 8, 12, 0.94));
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.05),
            0 28px 80px rgba(0, 0, 0, 0.36);
        }

        .hero-copy {
          border-radius: 40px;
          padding: 56px 44px;
          text-align: center;
        }

        .hero-copy::before,
        .why-shell::before,
        .plan-card::before {
          content: "";
          position: absolute;
          inset: auto auto 0 0;
          width: 220px;
          height: 220px;
          background: radial-gradient(circle, rgba(46, 118, 255, 0.24), transparent 70%);
          pointer-events: none;
        }

        .eyebrow {
          margin-bottom: 16px;
          color: rgba(162, 178, 214, 0.8);
          font-size: 0.74rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          color: rgba(237, 241, 255, 0.88);
          font-size: 0.95rem;
          margin-left: auto;
          margin-right: auto;
        }

        .pill-badge__new {
          padding: 6px 12px;
          border-radius: 999px;
          background: linear-gradient(135deg, #1a75ff, #3d8dff);
          box-shadow: 0 0 24px rgba(45, 118, 255, 0.38);
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.1em;
        }

        h1 {
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          font-size: clamp(4rem, 9vw, 7rem);
          line-height: 0.94;
          letter-spacing: -0.08em;
          font-weight: 300;
          color: #f8faff;
        }

        .headline-top,
        .headline-bottom {
          display: block;
        }

        .headline-bottom {
          white-space: nowrap;
          color: rgba(240, 244, 255, 0.95);
          font-weight: 400;
        }

        .hero-text {
          max-width: 780px;
          margin: 26px 0 0;
          margin-left: auto;
          margin-right: auto;
          color: rgba(210, 217, 234, 0.78);
          font-size: 1.08rem;
          font-weight: 350;
          letter-spacing: -0.02em;
          line-height: 1.8;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 14px;
          margin-top: 32px;
        }

        .primary-cta,
        .secondary-cta,
        .plan-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          min-height: 58px;
          padding: 0 24px;
          border-radius: 999px;
          text-decoration: none;
          font-size: 0.98rem;
          font-weight: 400;
          letter-spacing: -0.03em;
          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            border-color 180ms ease;
        }

        .primary-cta {
          color: #ffffff;
          background: linear-gradient(135deg, #1c72ff, #3d8bff);
          box-shadow:
            0 0 0 1px rgba(142, 180, 255, 0.22),
            0 0 42px rgba(27, 114, 255, 0.46);
        }

        .secondary-cta,
        .plan-cta {
          color: rgba(244, 247, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
        }

        .plan-cta--primary {
          color: #ffffff;
          background: linear-gradient(135deg, #1c72ff, #3d8bff);
          border-color: rgba(140, 178, 255, 0.3);
          box-shadow:
            0 0 0 1px rgba(142, 180, 255, 0.16),
            0 0 32px rgba(27, 114, 255, 0.35);
        }

        .primary-cta:hover,
        .secondary-cta:hover,
        .plan-cta:hover {
          transform: translateY(-1px);
        }

        .hero-foot {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 34px;
          text-align: left;
        }

        .hero-proof {
          padding: 18px 18px 20px;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
        }

        .hero-proof__title {
          display: block;
          margin-bottom: 8px;
          color: #f6f8ff;
          font-size: 0.92rem;
          font-weight: 500;
          letter-spacing: -0.02em;
        }

        .hero-proof__text {
          color: rgba(206, 214, 232, 0.72);
          line-height: 1.7;
          font-size: 0.92rem;
          font-weight: 350;
        }

        .why-shell {
          border-radius: 34px;
          padding: 32px;
        }

        .section-heading--center {
          margin-left: auto;
          margin-right: auto;
          text-align: center;
        }

        .panel-list {
          display: grid;
          gap: 14px;
          margin-top: 22px;
        }

        .panel-item {
          display: grid;
          grid-template-columns: 64px minmax(0, 1fr);
          gap: 12px;
          padding: 18px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .panel-index {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(29, 114, 255, 0.24), rgba(71, 143, 255, 0.14));
          color: #9cc0ff;
          font-size: 0.9rem;
          font-weight: 700;
        }

        .panel-item p,
        .feature-card p,
        .step-card p,
        .plan-description,
        .plan-feature {
          margin: 0;
          color: rgba(208, 215, 232, 0.76);
          line-height: 1.8;
        }

        .section-grid {
          margin-top: 26px;
        }

        .section-heading {
          max-width: 820px;
          margin-bottom: 18px;
        }

        .section-heading--wide {
          max-width: 980px;
        }

        h2 {
          margin: 0;
          font-size: clamp(2rem, 4vw, 3.4rem);
          line-height: 1.02;
          letter-spacing: -0.06em;
          color: #f8faff;
          font-weight: 350;
        }

        .steps-grid,
        .feature-grid,
        .plans-grid {
          display: grid;
          gap: 18px;
        }

        .steps-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .feature-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .plans-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .step-card,
        .feature-card {
          border-radius: 28px;
          padding: 28px;
        }

        .step-number {
          margin-bottom: 18px;
          color: #8fb6ff;
          font-size: 0.86rem;
          letter-spacing: 0.16em;
        }

        .feature-card__title {
          margin-bottom: 12px;
          color: #f8faff;
          font-size: 1.6rem;
          line-height: 1.1;
          letter-spacing: -0.05em;
          font-weight: 400;
        }

        .plans-shell {
          margin-top: 26px;
        }

        .plan-card {
          border-radius: 30px;
          padding: 28px;
        }

        .plan-card--recommended {
          border-color: rgba(118, 159, 255, 0.26);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.05),
            0 0 0 1px rgba(57, 119, 255, 0.12),
            0 26px 90px rgba(7, 25, 69, 0.44);
        }

        .plan-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 22px;
        }

        .plan-name {
          color: #f7f9ff;
          font-size: 1.7rem;
          letter-spacing: -0.05em;
          font-weight: 400;
        }

        .plan-subtitle {
          margin-top: 6px;
          color: rgba(167, 181, 214, 0.72);
          line-height: 1.6;
        }

        .plan-badge {
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(40, 114, 255, 0.14);
          color: #9ec2ff;
          font-size: 0.76rem;
          letter-spacing: 0.12em;
          white-space: nowrap;
        }

        .plan-price {
          margin-bottom: 12px;
          color: #ffffff;
          font-size: 2.4rem;
          line-height: 1;
          letter-spacing: -0.06em;
          font-weight: 350;
        }

        .plan-description {
          margin-bottom: 20px;
        }

        .plan-features {
          display: grid;
          gap: 12px;
          margin-bottom: 24px;
        }

        .plan-feature {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .plan-feature__dot {
          width: 9px;
          height: 9px;
          margin-top: 11px;
          border-radius: 999px;
          background: linear-gradient(135deg, #6ea4ff, #2458ff);
          box-shadow: 0 0 20px rgba(36, 88, 255, 0.8);
          flex: 0 0 auto;
        }

        @media (max-width: 1100px) {
          .steps-grid,
          .feature-grid,
          .plans-grid {
            grid-template-columns: 1fr;
          }

          .headline-bottom {
            white-space: normal;
          }
        }

        @media (max-width: 760px) {
          .creator-home {
            padding: 20px 12px 84px;
          }

          .hero-shell {
            padding-top: 34px;
          }

          .hero-copy,
          .why-shell,
          .step-card,
          .feature-card,
          .plan-card {
            border-radius: 26px;
            padding: 22px;
          }

          .pill-badge {
            align-items: flex-start;
            flex-direction: column;
            border-radius: 22px;
          }

          h1 {
            gap: 8px;
            line-height: 0.98;
          }

          .hero-text {
            font-size: 1rem;
          }

          .hero-foot {
            grid-template-columns: 1fr;
          }

          .primary-cta,
          .secondary-cta,
          .plan-cta {
            width: 100%;
          }

          .plan-top {
            flex-direction: column;
          }

          .panel-item {
            grid-template-columns: 1fr;
          }

          .panel-index {
            width: 48px;
            height: 48px;
          }
        }
      `}</style>
    </>
  )
}
