import InternalReviewClientPage from '@/app/internal/review-client'
import { listCreatorApplications } from '@/lib/creator-admin'

export default async function InternalReviewPage() {
  const applications = await listCreatorApplications()

  return <InternalReviewClientPage initialApplications={applications} />
}
