import PageWrapper from "@/components/ui/PageWrapper"
import UploadPanel from "@/components/upload/UploadPanel"

export default function UploadPage() {
  return (
    <PageWrapper>
      <div className="mx-auto w-full max-w-2xl space-y-8 animate-fadeIn">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Upload results</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Upload a blood test file in CSV, PDF, or image format. Biomarker values will be
            extracted automatically — you can review and edit them before saving.
          </p>
        </div>
        <UploadPanel />
      </div>
    </PageWrapper>
  )
}

