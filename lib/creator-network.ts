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
    'idea-library': 'https://idea-brainstorm.vercel.app',
    'script-creation': 'https://script-generator-xi.vercel.app',
    storyboard: 'https://soon-storyboard.vercel.app',
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
      subtitle: '先加入 SOON creator pool',
      description: '適合想先安全接 job、入 creator database，同時保留完全自由度嘅 creator。',
      features: [
        '進入 SOON creator database',
        '安全接 job，客戶先付款',
        '可被配對 client campaign',
        '0 monthly credits',
      ],
    },
    {
      id: 'creator-growth',
      name: 'Creator Growth',
      monthlyLabel: 'HK$299 / 月',
      subtitle: '最適合大部分 creator',
      description: '除咗接 job，仲可以用 credit 方式進入 SOON internal system，加速出題材、整腳本同做 storyboard planning。',
      features: [
        '6 monthly credits',
        '題材庫：每次 1 credit',
        'Script creation：每次 2 credits',
        'Storyboard：每次 2 credits',
        '優先接 campaign matching',
      ],
      recommended: true,
    },
    {
      id: 'creator-studio',
      name: 'Creator Studio',
      monthlyLabel: 'HK$699 / 月',
      subtitle: '重度使用 AI workflow',
      description: '適合想將 SOON 系統當成自己創作工作台，用更高 monthly credits 跑更多 script / storyboard workflow。',
      features: [
        '30 monthly credits',
        '題材庫：每次 1 credit',
        'Script creation：每次 2 credits',
        'Storyboard：每次 2 credits',
        '優先 creator support',
        '較高 usage ceiling',
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
        description: '從 SOON 題材庫搵啱你風格、啱你 audience 嘅內容方向。',
        quotaLabel: '每月 6 credits',
        creditCost: 1,
        creditCostLabel: '每次使用扣 1 credit',
        unlocked: paidActive,
        statusLabel: paidActive ? '已開通' : '等待付款',
      },
      {
        title: 'Script Creation',
        slug: 'script-creation',
        description: '根據你嘅 creator style 同 campaign 方向，生成第一輪腳本規劃。',
        quotaLabel: '每月 6 credits',
        creditCost: 2,
        creditCostLabel: '每次使用扣 2 credits',
        unlocked: paidActive,
        statusLabel: paidActive ? '已開通' : '等待付款',
      },
      {
        title: 'Storyboard',
        slug: 'storyboard',
        description: '將內容進一步拆成鏡頭結構、拍攝方向同 must-have shots。',
        quotaLabel: '每月 6 credits',
        creditCost: 2,
        creditCostLabel: '每次使用扣 2 credits',
        unlocked: paidActive,
        statusLabel: paidActive ? '已開通' : '等待付款',
      },
      {
        title: 'AI 生成影片',
        slug: 'ai-video',
        description: 'AI 生片功能之後會再開放到 creator plans。',
        quotaLabel: '暫未開放',
        creditCost: 0,
        unlocked: false,
        statusLabel: 'Locked',
      },
    ] satisfies CreatorToolAccess[]
  }

  if (planId === 'creator-studio') {
    return [
      {
        title: '題材庫',
        slug: 'idea-library',
        description: '從 SOON 題材庫搵啱你風格、啱你 audience 嘅內容方向。',
        quotaLabel: '每月 30 credits',
        creditCost: 1,
        creditCostLabel: '每次使用扣 1 credit',
        unlocked: paidActive,
        statusLabel: paidActive ? '已開通' : '等待付款',
      },
      {
        title: 'Script Creation',
        slug: 'script-creation',
        description: '根據你嘅 creator style 同 campaign 方向，生成第一輪腳本規劃。',
        quotaLabel: '每月 30 credits',
        creditCost: 2,
        creditCostLabel: '每次使用扣 2 credits',
        unlocked: paidActive,
        statusLabel: paidActive ? '已開通' : '等待付款',
      },
      {
        title: 'Storyboard',
        slug: 'storyboard',
        description: '將內容進一步拆成鏡頭結構、拍攝方向同 must-have shots。',
        quotaLabel: '每月 30 credits',
        creditCost: 2,
        creditCostLabel: '每次使用扣 2 credits',
        unlocked: paidActive,
        statusLabel: paidActive ? '已開通' : '等待付款',
      },
      {
        title: 'AI 生成影片',
        slug: 'ai-video',
        description: 'AI 生片功能會之後再按 creator plan 分批開放。',
        quotaLabel: '暫未開放',
        creditCost: 0,
        unlocked: false,
        statusLabel: 'Locked',
      },
    ] satisfies CreatorToolAccess[]
  }

  return [
    {
      title: '題材庫',
      slug: 'idea-library',
      description: '加入更高 creator plan 後先會開放。',
      quotaLabel: '未開通',
      creditCost: 0,
      unlocked: false,
      statusLabel: 'Locked',
    },
    {
      title: 'Script Creation',
      slug: 'script-creation',
      description: '加入更高 creator plan 後先會開放。',
      quotaLabel: '未開通',
      creditCost: 0,
      unlocked: false,
      statusLabel: 'Locked',
    },
    {
      title: 'Storyboard',
      slug: 'storyboard',
      description: '加入更高 creator plan 後先會開放。',
      quotaLabel: '未開通',
      creditCost: 0,
      unlocked: false,
      statusLabel: 'Locked',
    },
    {
      title: 'AI 生成影片',
      slug: 'ai-video',
      description: 'AI 生片功能之後再按 plan 開放。',
      quotaLabel: '未開通',
      creditCost: 0,
      unlocked: false,
      statusLabel: 'Locked',
    },
  ] satisfies CreatorToolAccess[]
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
