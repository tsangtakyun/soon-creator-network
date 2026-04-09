export type CreatorApplyForm = {
  creatorName: string
  contactName: string
  email: string
  whatsapp: string
  location: string
  languages: string
  primaryPlatform: string
  instagramUrl: string
  tiktokUrl: string
  youtubeUrl: string
  threadsUrl: string
  xiaohongshuUrl: string
  otherLinks: string
  contentCategories: string
  contentFormats: string
  audienceRegions: string
  audienceAgeGroups: string
  hasBrandCollabs: string
  hasConversionCampaigns: string
  usualReelRate: string
  availableRegions: string
  turnaroundDays: string
  topContentLinks: string
  analyticsNotes: string
  analyticsDriveLinks: string
  selectedPlan: string
}

export const defaultCreatorApplyForm: CreatorApplyForm = {
  creatorName: '',
  contactName: '',
  email: '',
  whatsapp: '',
  location: '',
  languages: '',
  primaryPlatform: 'instagram',
  instagramUrl: '',
  tiktokUrl: '',
  youtubeUrl: '',
  threadsUrl: '',
  xiaohongshuUrl: '',
  otherLinks: '',
  contentCategories: '',
  contentFormats: '',
  audienceRegions: '',
  audienceAgeGroups: '',
  hasBrandCollabs: '',
  hasConversionCampaigns: '',
  usualReelRate: '',
  availableRegions: '',
  turnaroundDays: '',
  topContentLinks: '',
  analyticsNotes: '',
  analyticsDriveLinks: '',
  selectedPlan: 'creator-core',
}

export type CreatorPlan = {
  id: string
  name: string
  monthlyLabel: string
  subtitle: string
  description: string
  features: string[]
  recommended?: boolean
}

export function getCreatorPlans(): CreatorPlan[] {
  return [
    {
      id: 'creator-core',
      name: 'Creator Core',
      monthlyLabel: 'HK$0 / 月',
      subtitle: '先加入 SOON creator pool',
      description: '適合想先安全接 job、入 creator database，同時保留完全自由度嘅 creator。',
      features: [
        '進入 SOON creator database',
        '安全接 job，客戶先付款',
        '可被配對 client campaign',
        '基本 creator workspace',
      ],
    },
    {
      id: 'creator-growth',
      name: 'Creator Growth',
      monthlyLabel: 'HK$299 / 月',
      subtitle: '最適合大部分 creator',
      description: '除咗接 job，仲可以定期用 SOON internal system 幫你加速出題材、整腳本、做 planning。',
      features: [
        '題材庫 access',
        'Script creation planning',
        'Storyboard planning access',
        '優先接 campaign matching',
      ],
      recommended: true,
    },
    {
      id: 'creator-studio',
      name: 'Creator Studio',
      monthlyLabel: 'HK$699 / 月',
      subtitle: '重度使用 AI workflow',
      description: '適合想將 SOON 系統當成自己創作工作台，用埋 AI 生片、深度 workflow 同進階 support。',
      features: [
        '題材庫 + script + storyboard 全 access',
        'AI 生片配額',
        '優先 creator support',
        '較進階 campaign workflow tools',
      ],
    },
  ]
}

export function buildCreatorValueProps() {
  return [
    '所有 job 經 SOON system 跑，客戶先付款，你唔使驚拖數。',
    'SOON internal system 持續有題材庫、AI planning 同 AI gen tools，俾你按需要增值。',
    '唔使簽死約，自己決定接唔接合作、點樣發展自己嘅 creator 路。',
  ]
}

export function buildCreatorAiPreview(form: CreatorApplyForm) {
  if (!form.creatorName.trim()) return null

  const categories = form.contentCategories.toLowerCase()
  const primaryPlatform = form.primaryPlatform.toLowerCase()
  const selectedPlan = getCreatorPlans().find((plan) => plan.id === form.selectedPlan)

  return {
    archetype: categories.includes('food')
      ? 'Food Discovery Creator'
      : categories.includes('travel')
        ? 'Travel Experience Creator'
        : categories.includes('lifestyle')
          ? 'Lifestyle Trust Creator'
          : 'Multi-Category Creator',
    fitObjective: form.hasConversionCampaigns.trim()
      ? '適合接 conversion / trust-driven campaigns'
      : '適合先接 awareness / engagement campaigns',
    strength: primaryPlatform === 'instagram'
      ? '適合短片內容、brand-facing Reel 合作同 visual storytelling'
      : '適合用自身平台特性做 niche audience matching',
    fitSummary: categories.includes('food')
      ? '較適合餐飲、打卡位、到店體驗類 campaign'
      : categories.includes('travel')
        ? '較適合旅遊體驗、地點敘事、攻略內容類 campaign'
        : categories.includes('lifestyle')
          ? '較適合品牌感、信任感、日常植入類 campaign'
          : '較適合做 multi-angle 測試型 campaign',
    selectedPlanSummary: selectedPlan
      ? `${selectedPlan.name} · ${selectedPlan.subtitle}`
      : '未揀計劃',
  }
}

export function buildCreatorApplicationPayload(form: CreatorApplyForm) {
  const preview = buildCreatorAiPreview(form)

  return {
    creator_name: form.creatorName.trim(),
    contact_name: form.contactName.trim(),
    email: form.email.trim().toLowerCase(),
    whatsapp: form.whatsapp.trim(),
    location: form.location.trim(),
    languages: form.languages.trim(),
    primary_platform: form.primaryPlatform.trim(),
    instagram_url: form.instagramUrl.trim(),
    tiktok_url: form.tiktokUrl.trim(),
    youtube_url: form.youtubeUrl.trim(),
    threads_url: form.threadsUrl.trim(),
    xiaohongshu_url: form.xiaohongshuUrl.trim(),
    other_links: form.otherLinks.trim(),
    content_categories: form.contentCategories.trim(),
    content_formats: form.contentFormats.trim(),
    audience_regions: form.audienceRegions.trim(),
    audience_age_groups: form.audienceAgeGroups.trim(),
    has_brand_collabs: form.hasBrandCollabs.trim(),
    has_conversion_campaigns: form.hasConversionCampaigns.trim(),
    usual_reel_rate: form.usualReelRate.trim(),
    available_regions: form.availableRegions.trim(),
    turnaround_days: form.turnaroundDays.trim(),
    top_content_links: form.topContentLinks.trim(),
    analytics_notes: form.analyticsNotes.trim(),
    analytics_drive_links: form.analyticsDriveLinks.trim(),
    selected_plan: form.selectedPlan.trim(),
    ai_analysis: preview
      ? {
          archetype: preview.archetype,
          fit_objective: preview.fitObjective,
          strength_summary: preview.strength,
          fit_summary: preview.fitSummary,
          selected_plan_summary: preview.selectedPlanSummary,
        }
      : {},
  }
}
