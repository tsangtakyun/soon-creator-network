import { createAdminSupabase } from '@/lib/server-supabase'

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
