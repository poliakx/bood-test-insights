import type { ChatContext } from './buildChatContext'

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2)
}

export async function generateChatResponse(
  prompt: string,
  context: ChatContext,
): Promise<string> {
  const normalizedPrompt = prompt.trim().toLowerCase()

  if (!context.latestResult) {
    return 'I do not have any saved blood test results yet. Upload and save a result first.'
  }

  if (
    normalizedPrompt.includes('summary') ||
    normalizedPrompt.includes('overall') ||
    normalizedPrompt.includes('огляд')
  ) {
    const abnormalCount = context.abnormalBiomarkers.length
    return `Latest test date: ${context.latestResult.testDate}. Biomarkers: ${context.latestResult.biomarkerCount}. Abnormal markers detected: ${abnormalCount}.`
  }

  if (
    normalizedPrompt.includes('abnormal') ||
    normalizedPrompt.includes('high') ||
    normalizedPrompt.includes('low')
  ) {
    if (context.abnormalBiomarkers.length === 0) {
      return 'I do not see out-of-range biomarkers in the latest saved result.'
    }

    const top = context.abnormalBiomarkers
      .slice(0, 3)
      .map((item) => `${item.name} ${formatNumber(item.value)} ${item.unit}`)
      .join(', ')

    return `Potentially out-of-range biomarkers in the latest result: ${top}.`
  }

  if (
    normalizedPrompt.includes('trend') ||
    normalizedPrompt.includes('change') ||
    normalizedPrompt.includes('динаміка') ||
    normalizedPrompt.includes('зміна')
  ) {
    if (context.trendSummaries.length === 0) {
      return 'Not enough data to show trends. Save at least two results to compare.'
    }

    const lines = context.trendSummaries
      .slice(0, 4)
      .map((item) => {
        const sign = item.delta > 0 ? '+' : ''
        const arrow = item.direction === 'up' ? '↑' : item.direction === 'down' ? '↓' : '→'
        return `${item.name}: ${formatNumber(item.latestValue)} ${item.unit} (${arrow} ${sign}${formatNumber(item.delta)})`
      })
      .join(', ')

    return `Trend summary across ${context.totalResults} results: ${lines}.`
  }

  const requestedBiomarker = context.availableBiomarkerNames.find((name) =>
    normalizedPrompt.includes(name.toLowerCase()),
  )

  if (requestedBiomarker) {
    const latest = context.latestBiomarkers.find(
      (item) => item.name.toLowerCase() === requestedBiomarker.toLowerCase(),
    )

    if (!latest) {
      return `I found ${requestedBiomarker} in history, but it is not present in the latest saved test.`
    }

    return `Latest ${latest.name}: ${formatNumber(latest.value)} ${latest.unit} (test date: ${latest.testDate}).`
  }

  return `I can help with the latest result from ${context.latestResult.testDate}. Ask for summary, abnormal markers, or a biomarker by name.`
}
