import { afterEach, describe, expect, test, vi } from 'vitest'
import { saveReviewedUploadResult } from '../services/integration/saveReviewedUploadResult'
import { BLOOD_TEST_SAVED_EVENT } from '../hooks/useBloodTestHistory'
import type { BloodTestResult } from '../features/blood-test/types'

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

function createResult(id: string): BloodTestResult {
  return {
    id,
    testDate: '2026-03-25',
    uploadedAt: '2026-03-25T09:00:00.000Z',
    sourceFileName: 'report.pdf',
    sourceType: 'pdf',
    biomarkers: [{ id: 'g1', name: 'Glucose', value: 96, unit: 'mg/dL' }],
  }
}

describe('saveReviewedUploadResult', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('prepends new result before existing results in localStorage', () => {
    const existing = createResult('existing-1')
    const localStorage = createLocalStorageMock({
      blood_test_results: JSON.stringify([existing]),
    })
    vi.stubGlobal('window', { dispatchEvent: vi.fn() })
    vi.stubGlobal('localStorage', localStorage)

    saveReviewedUploadResult(createResult('new-1'))

    const saved = JSON.parse(
      localStorage.setItem.mock.calls.at(-1)![1],
    ) as BloodTestResult[]
    expect(saved).toHaveLength(2)
    expect(saved[0].id).toBe('new-1')
    expect(saved[1].id).toBe('existing-1')
  })

  test('saves a single result when storage is empty', () => {
    const localStorage = createLocalStorageMock()
    vi.stubGlobal('window', { dispatchEvent: vi.fn() })
    vi.stubGlobal('localStorage', localStorage)

    saveReviewedUploadResult(createResult('first-1'))

    const saved = JSON.parse(
      localStorage.setItem.mock.calls.at(-1)![1],
    ) as BloodTestResult[]
    expect(saved).toHaveLength(1)
    expect(saved[0].id).toBe('first-1')
  })

  test('dispatches bloodTestSaved custom event after saving', () => {
    const dispatchEvent = vi.fn()
    vi.stubGlobal('window', { dispatchEvent })
    vi.stubGlobal('localStorage', createLocalStorageMock())

    saveReviewedUploadResult(createResult('r1'))

    expect(dispatchEvent).toHaveBeenCalledOnce()
    const event = dispatchEvent.mock.calls[0][0] as CustomEvent
    expect(event.type).toBe(BLOOD_TEST_SAVED_EVENT)
  })

  test('dispatches the event even when there are no prior results', () => {
    const dispatchEvent = vi.fn()
    vi.stubGlobal('window', { dispatchEvent })
    vi.stubGlobal('localStorage', createLocalStorageMock())

    saveReviewedUploadResult(createResult('r2'))

    expect(dispatchEvent).toHaveBeenCalledOnce()
  })
})
