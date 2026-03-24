"use client"

import { useEffect, useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import useBloodTestHistory from '@/src/hooks/useBloodTestHistory'
import BiomarkerSelector from './BiomarkerSelector'
import { buildTrendData } from '@/src/utils/buildTrendData'
import { formatShort } from '@/src/utils/date'

export default function TrendsChart() {
  const { history } = useBloodTestHistory()

  const biomarkerOptions = useMemo(() => {
    const names = new Set<string>()
    for (const result of history) {
      for (const biomarker of result.biomarkers) {
        const cleanName = biomarker.name.trim()
        if (cleanName) names.add(cleanName)
      }
    }
    return [...names].sort((a, b) => a.localeCompare(b))
  }, [history])

  const [selectedBiomarkerName, setSelectedBiomarkerName] = useState('')

  useEffect(() => {
    if (!selectedBiomarkerName && biomarkerOptions.length > 0) {
      setSelectedBiomarkerName(biomarkerOptions[0])
      return
    }

    if (
      selectedBiomarkerName &&
      !biomarkerOptions.includes(selectedBiomarkerName)
    ) {
      setSelectedBiomarkerName(biomarkerOptions[0] ?? '')
    }
  }, [biomarkerOptions, selectedBiomarkerName])

  const trendData = useMemo(
    () => buildTrendData(history, selectedBiomarkerName),
    [history, selectedBiomarkerName],
  )

  const chartData = useMemo(
    () =>
      trendData.map((point) => ({
        ...point,
        label: formatShort(point.date),
      })),
    [trendData],
  )

  const latestValue = chartData.length > 0 ? chartData[chartData.length - 1].value : null
  const previousValue = chartData.length > 1 ? chartData[chartData.length - 2].value : null
  const delta = latestValue !== null && previousValue !== null ? latestValue - previousValue : null

  if (history.length === 0) {
    return <p className="text-sm text-gray-500">No data yet. Save a result to see trends.</p>
  }

  if (biomarkerOptions.length === 0) {
    return <p className="text-sm text-gray-500">No biomarkers found in saved history.</p>
  }

  return (
    <div className="space-y-3">
      <BiomarkerSelector
        options={biomarkerOptions}
        value={selectedBiomarkerName}
        onChange={setSelectedBiomarkerName}
      />

      {chartData.length < 2 ? (
        <p className="text-sm text-gray-500">Not enough data to display a trend yet.</p>
      ) : (
        <>
          <div className="h-64 min-w-0 w-full rounded-md border border-gray-200 bg-white p-2">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
              <LineChart data={chartData} margin={{ top: 10, right: 16, bottom: 4, left: 4 }}>
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
            </ResponsiveContainer>
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
