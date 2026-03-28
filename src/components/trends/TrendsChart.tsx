"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import BiomarkerSelector from './BiomarkerSelector'
import useTrendsData from '@/hooks/useTrendsData'
import EmptyState from '@/components/ui/EmptyState'

export default function TrendsChart() {
  const {
    history,
    biomarkerOptions,
    selectedBiomarkerName,
    setSelectedBiomarkerName,
    chartData,
    latestValue,
    delta,
  } = useTrendsData()

  if (history.length === 0) {
    return (
      <EmptyState message="No trend data yet. Save a result to start comparing biomarkers over time." />
    )
  }

  if (biomarkerOptions.length === 0) {
    return (
      <EmptyState message="No biomarkers were found in saved history." />
    )
  }

  return (
    <div className="space-y-3">
      <BiomarkerSelector
        options={biomarkerOptions}
        value={selectedBiomarkerName}
        onChange={setSelectedBiomarkerName}
      />

      {chartData.length < 2 ? (
        <EmptyState message="Not enough saved results to display a trend yet." />
      ) : (
        <>
          <div className="w-full min-w-0 overflow-hidden rounded-md border border-gray-200 bg-white p-2">
            <LineChart
              responsive
              data={chartData}
              margin={{ top: 10, right: 16, bottom: 4, left: 4 }}
              className="h-64 min-h-[220px] w-full min-w-[280px]"
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} width={48} />
                <Tooltip
                  formatter={(value) => [value ?? '', selectedBiomarkerName]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
            </LineChart>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            {latestValue !== null ? (
              <span className="rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-gray-700">
                Latest: <strong>{latestValue}</strong>
              </span>
            ) : null}
            {delta !== null ? (
              <span className="rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-gray-700">
                Delta: <strong>{delta > 0 ? `+${delta}` : delta}</strong>
              </span>
            ) : null}
          </div>
        </>
      )}
    </div>
  )
}

