import PageWrapper from "@/src/components/ui/PageWrapper"
import HistoryList from "@/src/components/history/HistoryList"

export default function HistoryPage() {
  return (
    <PageWrapper>
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">History</h1>
          <p className="mt-2 text-sm text-gray-600">
            All your saved blood test results, most recent first.
          </p>
        </section>

        <HistoryList />
      </div>
    </PageWrapper>
  )
}
