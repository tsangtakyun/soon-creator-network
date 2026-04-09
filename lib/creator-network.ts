export type CreatorApplyForm = {
  creatorName: string
  contactName: string
  email: string
  whatsapp: string
  country: string
  languages: string[]
  primaryPlatform: string
  instagramUrl: string
  tiktokUrl: string
  youtubeUrl: string
  threadsUrl: string
  xiaohongshuUrl: string
  otherLinks: string
  contentCategories: string[]
  contentFormats: string[]
  audienceInsightLinks: string[]
  recentBrandCollabs: string[]
  recentConversionCampaigns: string[]
  usualReelRate: string
  usualPostRate: string
  usualStoryRate: string
  availableRegions: string[]
  turnaroundDays: string
  topContentLinks: string[]
  selectedPlan: string
}

export const defaultCreatorApplyForm: CreatorApplyForm = {
  creatorName: '',
  contactName: '',
  email: '',
  whatsapp: '',
  country: 'Hong Kong',
  languages: ['Cantonese'],
  primaryPlatform: 'instagram',
  instagramUrl: '',
  tiktokUrl: '',
  youtubeUrl: '',
  threadsUrl: '',
  xiaohongshuUrl: '',
  otherLinks: '',
  contentCategories: [],
  contentFormats: [],
  audienceInsightLinks: ['', '', ''],
  recentBrandCollabs: ['', '', '', '', ''],
  recentConversionCampaigns: ['', '', '', '', ''],
  usualReelRate: '',
  usualPostRate: '',
  usualStoryRate: '',
  availableRegions: ['Hong Kong'],
  turnaroundDays: '',
  topContentLinks: ['', '', ''],
  selectedPlan: 'creator-core',
}

export const creatorCountryOptions = [
  'Hong Kong',
  'United Kingdom',
  'United States',
  'Taiwan',
  'Japan',
  'Korea',
  'Singapore',
  'Malaysia',
  'China',
  'Macau',
]

export const creatorLanguageOptions = [
  'Cantonese',
  'English',
  'Mandarin',
  'Japanese',
  'Korean',
]

export const creatorContentCategoryOptions = [
  'food',
  'travel',
  'lifestyle',
  'beauty',
  'fitness',
  'tech',
  'couple',
  'family',
  'fashion',
  'comedy',
]

export const creatorContentFormatOptions = [
  'reel',
  'story',
  'post',
  'vlog',
  'talking head',
  'voice-over',
  'interview',
  'tutorial',
]

export const creatorAvailableRegionOptions = [
  'Hong Kong',
  'Kowloon',
  'New Territories',
  'Macau',
  'Shenzhen',
  'Guangzhou',
  'London',
  'UK-wide',
]

export const creatorRateRangeOptions = [
  'HK$1,000 - 3,000',
  'HK$3,000 - 5,000',
  'HK$5,000 - 8,000',
  'HK$8,000 - 12,000',
  'HK$12,000 - 20,000',
  'HK$20,000+',
]

export type CreatorPlan = {
  id: string
  name: string
  monthlyLabel: string
  subtitle: string
  description: string
  features: string[]
  recommended?: boolean
}

export type CreatorToolAccess = {
  title: string
  slug: string
  description: string
  quotaLabel: string
  creditCost: number
  creditCostLabel?: string
  unlocked: boolean
  statusLabel: string
}

export function getCreatorToolDestination(toolSlug: string) {
  const destinations: Record<string, string> = {
    'idea-library': 'https://idea-brainstorm.vercel.app?creator_mode=1',
    'script-creation': 'https://script-generator-xi.vercel.app?creator_mode=1',
    storyboard: 'https://soon-storyboard.vercel.app/storyboard?creator_mode=1',
  }

  return destinations[toolSlug] ?? ''
}

export function getCreatorMonthlyCredits(planId: string, paymentStatus: string) {
  const paidActive = !isPaidCreatorPlan(planId) || paymentStatus === 'paid'

  if (planId === 'creator-growth') {
    return paidActive ? 6 : 0
  }

  if (planId === 'creator-studio') {
    return paidActive ? 30 : 0
  }

  return 0
}

export function getCreatorPlans(): CreatorPlan[] {
  return [
    {
      id: 'creator-core',
      name: 'Creator Core',
      monthlyLabel: 'HK$0 / 月',
      subtitle: '先加入 SOON 創作者網絡',
      description: '適合希望先安全接案、進入創作者資料庫，同時保留完整自主度的創作者。',
      features: [
        '進入 SOON 創作者資料庫',
        '安全接案，客戶先付款',
        '可參與品牌合作配對',
        '每月 0 點',
      ],
    },
    {
      id: 'creator-growth',
      name: 'Creator Growth',
      monthlyLabel: 'HK$299 / 月',
      subtitle: '適合大部分創作者',
      description: '除了接案，亦可透過點數方式使用 SOON 內容工作流程，加快題材研究、腳本規劃與分鏡整理。',
      features: [
        '每月 6 點',
        '題材庫：每次 1 credit',
        '腳本規劃：每次 2 點',
        '分鏡整理：每次 2 點',
        '優先參與合作配對',
      ],
      recommended: true,
    },
    {
      id: 'creator-studio',
      name: 'Creator Studio',
      monthlyLabel: 'HK$699 / 月',
      subtitle: '適合高頻使用 AI 工作流程',
      description: '適合希望將 SOON 作為主要創作工作台，以更高每月點數支援更多腳本與分鏡流程的創作者。',
      features: [
        '每月 30 點',
        '題材庫：每次 1 credit',
        '腳本規劃：每次 2 點',
        '分鏡整理：每次 2 點',
        '優先支援服務',
        '更高使用上限',
      ],
    },
  ]
}

export function isPaidCreatorPlan(planId: string) {
  return planId === 'creator-growth' || planId === 'creator-studio'
}

export function getCreatorPlanById(planId: string) {
  return getCreatorPlans().find((plan) => plan.id === planId) ?? getCreatorPlans()[0]
}

export function buildCreatorToolAccess(planId: string, paymentStatus: string) {
  const paidActive = !isPaidCreatorPlan(planId) || paymentStatus === 'paid'

  if (planId === 'creator-growth') {
    return [
      {
        title: '題材庫',
        slug: 'idea-library',
        description: '從 SOON 題材庫整理適合你的風格與受眾的內容方向。',
        quotaLabel: '每月 6 點',
        creditCost: 1,
        creditCostLabel: '每次使用扣 1 點',
        unlocked: paidActive,
        statusLabel: paidActive ? '已開通' : '等待付款',
      },
      {
        title: '腳本規劃',
        slug: 'script-creation',
        description: '根據你的創作風格與合作方向，建立第一輪腳本規劃。',
        quotaLabel: '每月 6 點',
        creditCost: 2,
        creditCostLabel: '每次使用扣 2 點',
        unlocked: paidActive,
        statusLabel: paidActive ? '已開通' : '等待付款',
      },
      {
        title: '分鏡整理',
        slug: 'storyboard',
        description: '將內容進一步整理成鏡頭結構、拍攝方向與必要畫面。',
        quotaLabel: '每月 6 點',
        creditCost: 2,
        creditCostLabel: '每次使用扣 2 點',
        unlocked: paidActive,
        statusLabel: paidActive ? '已開通' : '等待付款',
      },
      {
        title: 'AI 生成影片',
        slug: 'ai-video',
        description: 'AI 生成影片功能將於後續階段逐步開放至創作者方案。',
        quotaLabel: '暫未開放',
        creditCost: 0,
        unlocked: false,
        statusLabel: '未開通',
      },
    ] satisfies CreatorToolAccess[]
  }

  if (planId === 'creator-studio') {
    return [
      {
        title: '題材庫',
        slug: 'idea-library',
        description: '從 SOON 題材庫整理適合你的風格與受眾的內容方向。',
        quotaLabel: '每月 30 點',
        creditCost: 1,
        creditCostLabel: '每次使用扣 1 點',
        unlocked: paidActive,
        statusLabel: paidActive ? '已開通' : '等待付款',
      },
      {
        title: '腳本規劃',
        slug: 'script-creation',
        description: '根據你的創作風格與合作方向，建立第一輪腳本規劃。',
        quotaLabel: '每月 30 點',
        creditCost: 2,
        creditCostLabel: '每次使用扣 2 點',
        unlocked: paidActive,
        statusLabel: paidActive ? '已開通' : '等待付款',
      },
      {
        title: '分鏡整理',
        slug: 'storyboard',
        description: '將內容進一步整理成鏡頭結構、拍攝方向與必要畫面。',
        quotaLabel: '每月 30 點',
        creditCost: 2,
        creditCostLabel: '每次使用扣 2 點',
        unlocked: paidActive,
        statusLabel: paidActive ? '已開通' : '等待付款',
      },
      {
        title: 'AI 生成影片',
        slug: 'ai-video',
        description: 'AI 生成影片功能將按不同創作者方案逐步開放。',
        quotaLabel: '暫未開放',
        creditCost: 0,
        unlocked: false,
        statusLabel: '未開通',
      },
    ] satisfies CreatorToolAccess[]
  }

  return [
    {
      title: '題材庫',
      slug: 'idea-library',
      description: '升級至更高方案後才會開放。',
      quotaLabel: '未開通',
      creditCost: 0,
      unlocked: false,
      statusLabel: '未開通',
    },
    {
      title: '腳本規劃',
      slug: 'script-creation',
      description: '升級至更高方案後才會開放。',
      quotaLabel: '未開通',
      creditCost: 0,
      unlocked: false,
      statusLabel: '未開通',
    },
    {
      title: '分鏡整理',
      slug: 'storyboard',
      description: '升級至更高方案後才會開放。',
      quotaLabel: '未開通',
      creditCost: 0,
      unlocked: false,
      statusLabel: '未開通',
    },
    {
      title: 'AI 生成影片',
      slug: 'ai-video',
      description: 'AI 生成影片功能將於後續階段再按方案開放。',
      quotaLabel: '未開通',
      creditCost: 0,
      unlocked: false,
      statusLabel: '未開通',
    },
  ] satisfies CreatorToolAccess[]
}

export function buildCreatorValueProps() {
  return [
    '所有合作皆經 SOON 系統處理，客戶完成付款後才進入正式製作流程，降低拖欠款項風險。',
    'SOON 內部系統持續提供題材研究、AI 規劃與生成工具，可按實際需要逐步啟用。',
    '無須受制於綁定式合約，你可自行決定是否合作，以及如何發展個人的創作方向。',
  ]
}

export function buildCreatorAiPreview(form: CreatorApplyForm) {
  if (!form.creatorName.trim()) return null

  const categories = form.contentCategories.join(' ').toLowerCase()
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
    fitObjective: form.recentConversionCampaigns.some((item) => item.trim())
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
    location: form.country.trim(),
    languages: form.languages.join(', '),
    primary_platform: form.primaryPlatform.trim(),
    instagram_url: form.instagramUrl.trim(),
    tiktok_url: form.tiktokUrl.trim(),
    youtube_url: form.youtubeUrl.trim(),
    threads_url: form.threadsUrl.trim(),
    xiaohongshu_url: form.xiaohongshuUrl.trim(),
    other_links: form.otherLinks.trim(),
    content_categories: form.contentCategories.join(', '),
    content_formats: form.contentFormats.join(', '),
    audience_regions: '',
    audience_age_groups: '',
    has_brand_collabs: form.recentBrandCollabs.filter(Boolean).join('\n'),
    has_conversion_campaigns: form.recentConversionCampaigns.filter(Boolean).join('\n'),
    usual_reel_rate: form.usualReelRate.trim(),
    usual_post_rate: form.usualPostRate.trim(),
    usual_story_rate: form.usualStoryRate.trim(),
    available_regions: form.availableRegions.join(', '),
    turnaround_days: form.turnaroundDays.trim(),
    top_content_links: form.topContentLinks.filter(Boolean).join('\n'),
    analytics_notes: '',
    analytics_drive_links: form.audienceInsightLinks.filter(Boolean).join('\n'),
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
