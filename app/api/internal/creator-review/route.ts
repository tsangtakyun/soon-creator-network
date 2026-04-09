import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { createAdminSupabase } from '@/lib/server-supabase'
import { createServerSupabase } from '@/lib/server-supabase'

export async function POST(request: Request) {
  try {
    const allowedEmails = (process.env.ALLOWED_EMAILS ?? '')
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean)

    const cookieStore = await cookies()
    const supabase = createServerSupabase(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()
    const requesterEmail = user?.email?.toLowerCase() ?? ''

    if (!requesterEmail || (allowedEmails.length > 0 && !allowedEmails.includes(requesterEmail))) {
      return NextResponse.json({ error: '未授權操作。' }, { status: 401 })
    }

    const { id, reviewStatus, internalNotes } = await request.json() as {
      id?: string
      reviewStatus?: string
      internalNotes?: string
    }

    if (!id) {
      return NextResponse.json({ error: '缺少 creator application id。' }, { status: 400 })
    }

    if (!reviewStatus) {
      return NextResponse.json({ error: '缺少 review status。' }, { status: 400 })
    }

    const nextStatus = reviewStatus.trim().toLowerCase()
    const approvedAt = nextStatus === 'approved' ? new Date().toISOString() : null

    const adminSupabase = createAdminSupabase()
    const { error } = await adminSupabase
      .from('creator_applications')
      .update({
        review_status: nextStatus,
        internal_notes: internalNotes?.trim() ?? '',
        approved_at: approvedAt,
      })
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '更新 creator review 失敗。' },
      { status: 500 }
    )
  }
}
