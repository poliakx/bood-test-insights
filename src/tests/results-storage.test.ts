import { afterEach, describe, expect, test, vi } from 'vitest'
import { getResults, saveResults } from '../services/storage/resultsStorage'
import type { BloodTestResult } from '../features/blood-test/types'

function createResult(): BloodTestResult[] {
  return [
    {
      id: 'result-1',
      testDate: '2026-03-20',
      uploadedAt: '2026-03-20T09:30:00.000Z',
      sourceFileName: 'march-2026.pdf',
      sourceType: 'pdf',
      biomarkers: [
        {
          id: 'glucose-1',
          name: 'Glucose',
          value: 96,
          unit: 'mg/dL',
        },
      ],
    },
  ]
}

function createLocalStorageMock(seed?: Record<string, string>) {
  const store = new Map(Object.entries(seed ?? {}))

  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value)
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key)
    }),
    clear: vi.fn(() => {
      store.clear()
    }),
  }
}

describe('resultsStorage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('returns empty array and does nothing when window is unavailable', () => {
    vi.stubGlobal('window', undefined)

    expect(() => saveResults(createResult())).not.toThrow()
    expect(getResults()).toEqual([])
  })

  test('saves and reads back valid results', () => {
    const localStorage = createLocalStorageMock()

    vi.stubGlobal('window', {})
    vi.stubGlobal('localStorage', localStorage)

    const results = createResult()
    saveResults(results)

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'blood_test_results',
      JSON.stringify(results),
    )
    expect(getResults()).toEqual(results)
  })

  test('returns empty array for invalid JSON', () => {
    vi.stubGlobal('window', {})
    vi.stubGlobal(
      'localStorage',
      createLocalStorageMock({
        blood_test_results: 'not-json',
      }),
    )

    expect(getResults()).toEqual([])
  })

  test('returns empty array for invalid stored schema', () => {
    vi.stubGlobal('window', {})
    vi.stubGlobal(
      'localStorage',
      createLocalStorageMock({
        blood_test_results: JSON.stringify([{ id: 'broken' }]),
      }),
    )

    expect(getResults()).toEqual([])
  })
})