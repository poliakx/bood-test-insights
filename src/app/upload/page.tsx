import PageWrapper from "@/src/components/ui/PageWrapper"
import UploadPanel from "@/src/components/upload/UploadPanel"
import HistoryList from "@/src/components/history/HistoryList"
import TrendsChart from "@/src/components/trends/TrendsChart"
import ChatPanel from "@/src/components/chat/ChatPanel"

export default function UploadPage() {
  return (
    <PageWrapper>
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Upload</h1>
          <p className="mt-2 text-sm text-gray-600">Upload your blood test PDFs or images here.</p>
        </section>

        <UploadPanel />

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">History</h2>
          <p className="mt-1 text-sm text-gray-600">Placeholder section for uploaded test history.</p>
          <div className="mt-3">
            <HistoryList />
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Trends</h2>
          <p className="mt-1 text-sm text-gray-600">Placeholder section for biomarker trends.</p>
          <div className="mt-3">
            <TrendsChart />
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Chat</h2>
          <p className="mt-1 text-sm text-gray-600">Placeholder section for AI chat insights.</p>
          <div className="mt-3">
            <ChatPanel />
          </div>
        </section>
      </div>
    </PageWrapper>
  )
}
