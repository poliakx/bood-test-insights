import PageWrapper from '@/src/components/ui/PageWrapper'
import UploadReviewPanel from '@/src/components/upload/UploadReviewPanel'

export default function UploadReviewPage() {
  return (
    <PageWrapper>
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Review extraction</h1>
          <p className="mt-2 text-sm text-gray-600">
            Review, edit, and save extracted biomarker information.
          </p>
        </section>

        <UploadReviewPanel />
      </div>
    </PageWrapper>
  )
}
