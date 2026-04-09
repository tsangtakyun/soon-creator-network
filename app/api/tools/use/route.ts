import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { getCreatorCreditSummary, listCreatorApplicationsByEmail } from '@/lib/creator-admin'
import { buildCreatorToolAccess, getCreatorToolDestination } from '@/lib/creator-network'
import { createAdminSupabase, createServerSupabase } from '@/lib/server-supabase'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerSupabase(cookieStore)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const email = user?.email?.trim().toLowerCase()
    if (!email) {
      return NextResponse.json({ error: '請先登入 Google account。' }, { status: 401 })
    }

    const { toolSlug } = await request.json()
    if (!toolSlug) {
      return NextResponse.json({ error: '缺少工具類型。' }, { status: 400 })
    }

    const applications = await listCreatorApplicationsByEmail(email)
    const latestApplication = applications[0]

    if (!latestApplication) {
      return NextResponse.json({ error: '未找到 creator application。' }, { status: 404 })
    }

    const tool = buildCreatorToolAccess(
      latestApplication.selected_plan,
      latestApplication.plan_payment_status
    ).find((item) => item.slug === toolSlug)

    if (!tool || !tool.unlocked) {
      return NextResponse.json({ error: '你目前 plan 未開通呢個工具。' }, { status: 403 })
    }

    const creditSummary = await getCreatorCreditSummary(latestApplication)

    if (creditSummary.remaining < tool.creditCost) {
      return NextResponse.json({ error: '本月 credits 不足。' }, { status: 403 })
    }

    const destinationUrl = getCreatorToolDestination(toolSlug)
    if (!destinationUrl) {
      return NextResponse.json({ error: '呢個工具暫時未有可用入口。' }, { status: 400 })
    }

    const admin = createAdminSupabase()
    const { error } = await admin.from('creator_usage_ledger').insert({
      application_id: latestApplication.id,
      tool_slug: tool.slug,
      credits_used: tool.creditCost,
      metadata: {
        creator_email: email,
        selected_plan: latestApplication.selected_plan,
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      url: destinationUrl,
      creditsUsed: tool.creditCost,
      creditsRemaining: creditSummary.remaining - tool.creditCost,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '未能開始工具流程。' },
      { status: 500 }
    )
  }
}
