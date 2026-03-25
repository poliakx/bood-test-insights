import { describe, expect, test } from 'vitest'
import { buildChatContext } from '../services/chat/buildChatContext'
import { generateChatResponse } from '../services/chat/generateChatResponse'
import type { BloodTestResult } from '../features/blood-test/types'

function createResult(
  id: string,
  testDate: string,
  biomarkers: BloodTestResult['biomarkers'],
): BloodTestResult {
  return {
    id,
    testDate,
    uploadedAt: `${testDate}T09:00:00.000Z`,
    sourceFileName: `${id}.pdf`,
    sourceType: 'pdf',
    biomarkers,
  }
}

describe('generateChatResponse', () => {
  test('returns empty-state message when no results are saved', async () => {
    const response = await generateChatResponse('summary', buildChatContext([]))

    expect(response).toBe(
      'I do not have any saved blood test results yet. Upload and save a result first.',
    )
  })

  test('returns summary for the latest result', async () => {
    const context = buildChatContext([
      createResult('latest', '2026-03-20', [
        {
          id: 'glucose-latest',
          name: 'Glucose',
          value: 96,
          unit: 'mg/dL',
          referenceRange: { min: 70, max: 100 },
          flag: 'normal',
        },
        {
          id: 'iron-latest',
          name: 'Iron',
          value: 52,
          unit: 'ug/dL',
          referenceRange: { min: 60, max: 170 },
          flag: 'low',
        },
      ]),
      createResult('older', '2026-02-20', [
        {
          id: 'glucose-older',
          name: 'Glucose',
          value: 99,
          unit: 'mg/dL',
          referenceRange: { min: 70, max: 100 },
          flag: 'normal',
        },
      ]),
    ])

    const response = await generateChatResponse('Give me a summary', context)

    expect(response).toBe(
      'Latest test date: 2026-03-20. Biomarkers: 2. Abnormal markers detected: 1.',
    )
  })

  test('returns abnormal biomarkers from the latest result', async () => {
    const context = buildChatContext([
      createResult('latest', '2026-03-20', [
        {
          id: 'glucose-latest',
          name: 'Glucose',
          value: 112,
          unit: 'mg/dL',
          referenceRange: { min: 70, max: 100 },
          flag: 'high',
        },
        {
          id: 'vitd-latest',
          name: 'Vitamin D',
          value: 18,
          unit: 'ng/mL',
          referenceRange: { min: 20, max: 50 },
          flag: 'low',
        },
      ]),
    ])

    const response = await generateChatResponse('Any abnormal markers?', context)

    expect(response).toBe(
      'Potentially out-of-range biomarkers in the latest result: Glucose 112 mg/dL, Vitamin D 18 ng/mL.',
    )
  })

  test('returns trend summary when multiple results exist', async () => {
    const context = buildChatContext([
      createResult('latest', '2026-03-20', [
        {
          id: 'glucose-latest',
          name: 'Glucose',
          value: 96,
          unit: 'mg/dL',
        },
        {
          id: 'iron-latest',
          name: 'Iron',
          value: 60,
          unit: 'ug/dL',
        },
      ]),
      createResult('older', '2026-02-20', [
        {
          id: 'glucose-older',
          name: 'Glucose',
          value: 100,
          unit: 'mg/dL',
        },
        {
          id: 'iron-older',
          name: 'Iron',
          value: 60,
          unit: 'ug/dL',
        },
      ]),
    ])

    const response = await generateChatResponse('Show me the trend', context)

    expect(response).toBe(
      'Trend summary across 2 results: Glucose: 96 mg/dL (↓ -4), Iron: 60 ug/dL (→ 0).',
    )
  })

  test('returns biomarker lookup for latest result and fallback guidance', async () => {
    const context = buildChatContext([
      createResult('latest', '2026-03-20', [
        {
          id: 'glucose-latest',
          name: 'Glucose',
          value: 96,
          unit: 'mg/dL',
        },
      ]),
      createResult('older', '2026-02-20', [
        {
          id: 'iron-older',
          name: 'Iron',
          value: 52,
          unit: 'ug/dL',
        },
      ]),
    ])

    await expect(generateChatResponse('What was my latest glucose?', context)).resolves.toBe(
      'Latest Glucose: 96 mg/dL (test date: 2026-03-20).',
    )

    await expect(generateChatResponse('What about iron?', context)).resolves.toBe(
      'I found Iron in history, but it is not present in the latest saved test.',
    )

    await expect(generateChatResponse('help me', context)).resolves.toBe(
      'I can help with the latest result from 2026-03-20. Ask for summary, abnormal markers, or a biomarker by name.',
    )
  })

  test('returns no-trend and no-abnormal fallbacks when appropriate', async () => {
    const context = buildChatContext([
      createResult('latest', '2026-03-20', [
        {
          id: 'glucose-latest',
          name: 'Glucose',
          value: 96,
          unit: 'mg/dL',
          referenceRange: { min: 70, max: 100 },
          flag: 'normal',
        },
      ]),
    ])

    await expect(generateChatResponse('trend', context)).resolves.toBe(
      'Not enough data to show trends. Save at least two results to compare.',
    )

    await expect(generateChatResponse('abnormal', context)).resolves.toBe(
      'I do not see out-of-range biomarkers in the latest saved result.',
    )
  })
})