import { expect, test } from 'vitest'
import { buildChatContext } from '../services/chat/buildChatContext'
import type { BloodTestResult } from '../features/blood-test/types'

test('buildChatContext exposes latest, abnormal, available, and trend data', () => {
  const results: BloodTestResult[] = [
    {
      id: 'latest',
      testDate: '2026-03-20',
      uploadedAt: '2026-03-20T09:30:00.000Z',
      sourceFileName: 'latest.pdf',
      sourceType: 'pdf',
      biomarkers: [
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
      ],
    },
    {
      id: 'older',
      testDate: '2026-02-20',
      uploadedAt: '2026-02-20T09:30:00.000Z',
      sourceFileName: 'older.pdf',
      sourceType: 'pdf',
      biomarkers: [
        {
          id: 'glucose-older',
          name: 'Glucose',
          value: 101,
          unit: 'mg/dL',
          referenceRange: { min: 70, max: 100 },
          flag: 'high',
        },
      ],
    },
  ]

  const context = buildChatContext(results)

  expect(context.latestResult).toEqual({
    id: 'latest',
    testDate: '2026-03-20',
    uploadedAt: '2026-03-20T09:30:00.000Z',
    sourceFileName: 'latest.pdf',
    sourceType: 'pdf',
    biomarkerCount: 2,
  })
  expect(context.abnormalBiomarkers).toEqual([
    {
      name: 'Iron',
      value: 52,
      unit: 'ug/dL',
      testDate: '2026-03-20',
      flag: 'low',
    },
  ])
  expect(context.availableBiomarkerNames).toEqual(['Glucose', 'Iron'])
  expect(context.trendSummaries).toEqual([
    {
      name: 'Glucose',
      unit: 'mg/dL',
      firstValue: 101,
      latestValue: 96,
      delta: -5,
      direction: 'down',
    },
  ])
})
