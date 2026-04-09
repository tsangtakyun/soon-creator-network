import { NextResponse } from 'next/server'

import { buildCreatorApplicationPayload, type CreatorApplyForm } from '@/lib/creator-network'
import { createAdminSupabase } from '@/lib/server-supabase'

export async function POST(request: Request) {
  try {
    const form = await request.json() as CreatorApplyForm

    if (!form.creatorName?.trim()) {
      return NextResponse.json({ error: '請先填 creator name。' }, { status: 400 })
    }

    if (!form.email?.trim()) {
      return NextResponse.json({ error: '請先填 email。' }, { status: 400 })
    }

    const supabase = createAdminSupabase()
    const payload = buildCreatorApplicationPayload(form)

    const { data, error } = await supabase
      .from('creator_applications')
      .insert(payload)
      .select('id')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ id: data.id }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '提交申請失敗。' },
      { status: 500 }
    )
  }
}
