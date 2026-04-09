import { NextResponse } from 'next/server'
import Stripe from 'stripe'

import { isPaidCreatorPlan } from '@/lib/creator-network'

type CreateCreatorCheckoutPayload = {
  applicationId?: string
  email?: string
  selectedPlan?: string
}

function getCreatorPlanPriceId(selectedPlan: string) {
  if (selectedPlan === 'creator-growth') {
    return process.env.STRIPE_CREATOR_GROWTH_PRICE_ID
  }

  if (selectedPlan === 'creator-studio') {
    return process.env.STRIPE_CREATOR_STUDIO_PRICE_ID
  }

  return null
}

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'STRIPE_SECRET_KEY not configured' }, { status: 500 })
  }

  let body: CreateCreatorCheckoutPayload

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  if (!body.applicationId) {
    return NextResponse.json({ error: 'Missing applicationId' }, { status: 400 })
  }

  if (!body.selectedPlan || !isPaidCreatorPlan(body.selectedPlan)) {
    return NextResponse.json({ error: 'Selected plan does not require payment' }, { status: 400 })
  }

  const priceId = getCreatorPlanPriceId(body.selectedPlan)

  if (!priceId) {
    return NextResponse.json({ error: 'Creator plan price id not configured' }, { status: 500 })
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const origin = process.env.NEXT_PUBLIC_APP_URL || request.headers.get('origin') || 'https://soon-creator-network.vercel.app'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: body.email || undefined,
      success_url: `${origin}/thank-you?id=${encodeURIComponent(body.applicationId)}&payment=success&plan=${encodeURIComponent(body.selectedPlan)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/apply?payment=cancelled`,
      metadata: {
        creator_application_id: body.applicationId,
        selected_plan: body.selectedPlan,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unable to create creator checkout session' }, { status: 500 })
  }
}
