import { createAdminSupabase } from '@/lib/server-supabase'
import { buildCreatorToolAccess, getCreatorMonthlyCredits } from '@/lib/creator-network'

export type CreatorApplicationRecord = {
  id: string
  creator_name: string
  contact_name: string
  email: string
  whatsapp: string
  location: string
  languages: string
  primary_platform: string
  instagram_url: string
  tiktok_url: string
  youtube_url: string
  threads_url: string
  xiaohongshu_url: string
  other_links: string
  content_categories: string
  content_formats: string
  audience_regions: string
  audience_age_groups: string
  has_brand_collabs: string
  has_conversion_campaigns: string
  usual_reel_rate: string
  usual_post_rate: string
  usual_story_rate: string
  available_regions: string
  turnaround_days: string
  top_content_links: string
  analytics_notes: string
  analytics_drive_links: string
  selected_plan: string
  plan_payment_status: string
  plan_payment_session_id: string
  stripe_customer_email: string
  plan_paid_at: string | null
  ai_analysis: {
    archetype?: string
    fit_objective?: string
    strength_summary?: string
    fit_summary?: string
  } | null
  review_status: string
  internal_notes: string
  approved_at: string | null
  created_at: string
}

export type CreatorUsageLedgerRecord = {
  id: string
  application_id: string
  tool_slug: string
  credits_used: number
  metadata: Record<string, unknown> | null
  created_at: string
}

function getCurrentMonthRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  return {
    startIso: start.toISOString(),
    endIso: end.toISOString(),
  }
}

export async function listCreatorApplications() {
  const supabase = createAdminSupabase()
  const { data, error } = await supabase
    .from('creator_applications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as CreatorApplicationRecord[]
}

export async function listApprovedCreators() {
  const supabase = createAdminSupabase()
  const { data, error } = await supabase
    .from('creator_applications')
    .select('*')
    .eq('review_status', 'approved')
    .order('approved_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as CreatorApplicationRecord[]
}

export async function listCreatorApplicationsByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase()
  const supabase = createAdminSupabase()
  const { data, error } = await supabase
    .from('creator_applications')
    .select('*')
    .or(`email.eq.${normalizedEmail},stripe_customer_email.eq.${normalizedEmail}`)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as CreatorApplicationRecord[]
}

export async function listCreatorUsageLedger(applicationId: string) {
  const supabase = createAdminSupabase()
  const { startIso, endIso } = getCurrentMonthRange()
  const { data, error } = await supabase
    .from('creator_usage_ledger')
    .select('*')
    .eq('application_id', applicationId)
    .gte('created_at', startIso)
    .lt('created_at', endIso)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as CreatorUsageLedgerRecord[]
}

export async function getCreatorCreditSummary(application: CreatorApplicationRecord | undefined) {
  if (!application) {
    return {
      allowance: 0,
      used: 0,
      remaining: 0,
      ledger: [] as CreatorUsageLedgerRecord[],
      ledgerReady: true,
    }
  }

  const allowance = getCreatorMonthlyCredits(application.selected_plan, application.plan_payment_status)
  try {
    const ledger = await listCreatorUsageLedger(application.id)
    const used = ledger.reduce((sum, item) => sum + Number(item.credits_used || 0), 0)

    return {
      allowance,
      used,
      remaining: Math.max(allowance - used, 0),
      ledger,
      ledgerReady: true,
    }
  } catch {
    return {
      allowance,
      used: 0,
      remaining: allowance,
      ledger: [] as CreatorUsageLedgerRecord[],
      ledgerReady: false,
    }
  }
}

export function getCreatorToolAccessWithBalance(
  application: CreatorApplicationRecord | undefined,
  remainingCredits: number
) {
  const baseTools = buildCreatorToolAccess(
    application?.selected_plan || 'creator-core',
    application?.plan_payment_status || 'not_required'
  )

  return baseTools.map((tool) => ({
    ...tool,
    unlocked: tool.unlocked && remainingCredits >= tool.creditCost,
    statusLabel: !tool.unlocked
      ? tool.statusLabel
      : remainingCredits >= tool.creditCost
        ? tool.statusLabel
        : 'Credits 不足',
  }))
}
