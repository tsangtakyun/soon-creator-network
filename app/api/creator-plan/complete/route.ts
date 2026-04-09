import { NextResponse } from 'next/server'
import Stripe from 'stripe'

import { createAdminSupabase } from '@/lib/server-supabase'

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'STRIPE_SECRET_KEY not configured' }, { status: 500 })
  }

  try {
    const { sessionId, applicationId } = await request.json() as {
      sessionId?: string
      applicationId?: string
    }

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
    }

    if (!applicationId) {
      return NextResponse.json({ error: 'Missing applicationId' }, { status: 400 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid' && session.status !== 'complete') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

    const adminSupabase = createAdminSupabase()
    const { error } = await adminSupabase
      .from('creator_applications')
      .update({
        plan_payment_status: 'paid',
        plan_payment_session_id: session.id,
        stripe_customer_email: session.customer_details?.email || session.customer_email || '',
        plan_paid_at: new Date().toISOString(),
      })
      .eq('id', applicationId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to complete creator payment' },
      { status: 500 }
    )
  }
}
