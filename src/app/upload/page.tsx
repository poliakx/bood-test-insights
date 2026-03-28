import PageWrapper from "@/components/ui/PageWrapper"
import UploadPanel from "@/components/upload/UploadPanel"

export default function UploadPage() {
  return (
    <PageWrapper>
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Upload results</h1>
          <p className="mt-2 text-sm text-gray-600">
            Upload a blood test file and continue to the review step after extraction.
          </p>
        </section>

        <UploadPanel />
      </div>
    </PageWrapper>
  )
}

