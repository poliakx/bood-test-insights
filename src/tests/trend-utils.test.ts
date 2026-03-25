import { expect, test } from 'vitest'
import { buildTrendData } from '../utils/buildTrendData'
import type { BloodTestResult } from '../features/blood-test/types'

function createResult(
  id: string,
  testDate: string,
  biomarkerName: string,
  value: number,
): BloodTestResult {
  return {
    id,
    testDate,
    uploadedAt: testDate,
    sourceFileName: `${id}.pdf`,
    sourceType: 'pdf',
    biomarkers: [
      {
        id: `${id}-b1`,
        name: biomarkerName,
        value,
        unit: 'mg/dL',
      },
    ],
  }
}

test('buildTrendData filters by biomarker name and sorts by date', () => {
  const results: BloodTestResult[] = [
    createResult('r2', '2024-03-10', 'Glucose', 102),
    createResult('r1', '2024-01-05', 'Glucose', 98),
    createResult('r3', '2024-02-01', 'Hemoglobin', 13.8),
  ]

  const data = buildTrendData(results, 'Glucose')

  expect(data).toEqual([
    { date: '2024-01-05', value: 98 },
    { date: '2024-03-10', value: 102 },
  ])
})

test('buildTrendData returns empty array for empty selected biomarker', () => {
  const data = buildTrendData([], '   ')
  expect(data).toEqual([])
})

test('buildTrendData returns empty array for empty history', () => {
  const data = buildTrendData([], 'Iron')
  expect(data).toEqual([])
})

test('buildTrendData returns empty array when selected biomarker has no values', () => {
  const results: BloodTestResult[] = [
    createResult('r1', '2024-01-05', 'Glucose', 98),
    createResult('r2', '2024-03-10', 'Hemoglobin', 13.8),
  ]

  const data = buildTrendData(results, 'Iron')
  expect(data).toEqual([])
})

test('buildTrendData can return a single point for biomarker with too few results', () => {
  const results: BloodTestResult[] = [createResult('r1', '2024-01-05', 'Iron', 52)]

  const data = buildTrendData(results, 'Iron')
  expect(data).toEqual([{ date: '2024-01-05', value: 52 }])
})

test('buildTrendData matches biomarker names case-insensitively', () => {
  const results: BloodTestResult[] = [createResult('r1', '2024-01-05', 'Glucose ', 98)]

  const data = buildTrendData(results, ' glucose')
  expect(data).toEqual([{ date: '2024-01-05', value: 98 }])
})

test('buildTrendData skips invalid dates and non-finite values', () => {
  const results: BloodTestResult[] = [
    createResult('r1', 'invalid-date', 'Glucose', 98),
    createResult('r2', '2024-02-01', 'Glucose', Number.POSITIVE_INFINITY),
    createResult('r3', '2024-03-01', 'Glucose', 101),
  ]

  const data = buildTrendData(results, 'Glucose')

  expect(data).toEqual([{ date: '2024-03-01', value: 101 }])
})
