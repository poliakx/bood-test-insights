import PageWrapper from "@/components/ui/PageWrapper"
import TrendsChart from "@/components/trends/TrendsChart"

export default function TrendsPage() {
  return (
    <PageWrapper>
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Trends</h1>
          <p className="mt-2 text-sm text-gray-600">
            Track how your biomarkers change across multiple test results.
          </p>
        </section>

        <TrendsChart />
      </div>
    </PageWrapper>
  )
}

