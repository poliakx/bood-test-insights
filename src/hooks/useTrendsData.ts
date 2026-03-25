import { useEffect, useMemo, useState } from 'react'
import useBloodTestHistory from '@/src/hooks/useBloodTestHistory'
import { buildTrendData } from '@/src/utils/buildTrendData'
import { formatShort } from '@/src/utils/date'

export default function useTrendsData() {
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

  return {
    history,
    biomarkerOptions,
    selectedBiomarkerName,
    setSelectedBiomarkerName,
    chartData,
    latestValue,
    delta,
  }
}
