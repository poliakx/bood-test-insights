"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '@/components/ui/PageWrapper'
import { getUploadDraft } from '@/services/storage/uploadDraftStorage'

export default function UploadExtractingPage() {
  const router = useRouter()

  useEffect(() => {
    const draft = getUploadDraft()
    if (!draft) {
      router.replace('/upload')
      return
    }

    const timer = window.setTimeout(() => {
      router.replace('/upload/review')
    }, 900)

    return () => window.clearTimeout(timer)
  }, [router])

  return (
    <PageWrapper>
      <div className="mx-auto w-full max-w-3xl">
        <section className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center gap-4 text-center">
            <span
              aria-hidden="true"
              className="h-9 w-9 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"
            />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Preparing extracted data</h1>
              <p className="mt-2 text-sm text-gray-600">
                We are finishing extraction and opening the review page.
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  )
}

