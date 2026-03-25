import { afterEach, describe, expect, test, vi } from 'vitest'
import { extractResults, detectSourceType } from '../services/extraction/extractResults'
import { mapRawToBiomarker, mapRawToResult } from '../features/blood-test/mappers'

describe('extraction helpers', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  test('detectSourceType recognizes supported file types', () => {
    expect(detectSourceType(new File(['a'], 'report.csv', { type: 'text/csv' }))).toBe('csv')
    expect(detectSourceType(new File(['a'], 'report.pdf', { type: 'application/pdf' }))).toBe('pdf')
    expect(detectSourceType(new File(['a'], 'photo.png', { type: 'image/png' }))).toBe('image')
    expect(detectSourceType(new File(['a'], 'notes.txt', { type: 'text/plain' }))).toBeNull()
  })

  test('extractResults rejects unsupported file types', async () => {
    await expect(
      extractResults(new File(['a'], 'notes.txt', { type: 'text/plain' })),
    ).rejects.toThrow('Unsupported file type. Please upload CSV, PDF, or image.')
  })

  test('extractResults maps uploaded file metadata onto mocked results', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-25T08:00:00.000Z'))

    const results = await extractResults(
      new File(['name,value\nGlucose,96'], 'upload.csv', { type: 'text/csv' }),
    )

    expect(results.length).toBeGreaterThan(0)
    expect(results.every((result: Awaited<typeof results>[number]) => result.sourceType === 'csv')).toBe(true)
    expect(results.every((result: Awaited<typeof results>[number]) => result.sourceFileName === 'upload.csv')).toBe(true)
    expect(results.every((result: Awaited<typeof results>[number]) => result.uploadedAt === '2026-03-25T08:00:00.000Z')).toBe(true)
  })

  test('mapRawToBiomarker coerces values and applies defaults', () => {
    expect(
      mapRawToBiomarker({
        id: 123,
        value: '98.5',
        referenceRange: { min: 70, max: 100 },
      }),
    ).toEqual({
      id: '123',
      name: 'Unknown',
      value: 98.5,
      unit: '',
      referenceRange: { min: 70, max: 100 },
      flag: undefined,
    })
  })

  test('mapRawToResult fills defaults and maps nested biomarkers', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-25T08:00:00.000Z'))

    expect(
      mapRawToResult({
        biomarkers: [{ id: 1, name: 'Glucose', value: '96', unit: 'mg/dL' }],
      }),
    ).toEqual({
      id: '',
      testDate: '2026-03-25T08:00:00.000Z',
      uploadedAt: '2026-03-25T08:00:00.000Z',
      sourceFileName: 'unknown',
      sourceType: 'csv',
      biomarkers: [
        {
          id: '1',
          name: 'Glucose',
          value: 96,
          unit: 'mg/dL',
          referenceRange: undefined,
          flag: undefined,
        },
      ],
    })
  })
})
