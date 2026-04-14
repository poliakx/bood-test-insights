import { afterEach, describe, expect, test, vi } from 'vitest'
import {
  saveUploadDraft,
  getUploadDraft,
  clearUploadDraft,
  type UploadDraft,
} from '../services/storage/uploadDraftStorage'

function createSessionStorageMock(seed?: Record<string, string>) {
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

function createDraft(): UploadDraft {
  return {
    result: {
      testDate: '2026-03-25',
      biomarkers: [{ id: 'b1', name: 'Glucose', value: 96, unit: 'mg/dL' }],
    },
    sourceType: 'csv',
    sourceFileName: 'report.csv',
  }
}

describe('uploadDraftStorage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('returns null and does nothing when window is unavailable', () => {
    vi.stubGlobal('window', undefined)
    expect(() => saveUploadDraft(createDraft())).not.toThrow()
    expect(getUploadDraft()).toBeNull()
    expect(() => clearUploadDraft()).not.toThrow()
  })

  test('saves and reads back a valid draft', () => {
    const sessionStorage = createSessionStorageMock()
    vi.stubGlobal('window', {})
    vi.stubGlobal('sessionStorage', sessionStorage)

    const draft = createDraft()
    saveUploadDraft(draft)

    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      'blood_test_upload_draft',
      JSON.stringify(draft),
    )
    expect(getUploadDraft()).toEqual(draft)
  })

  test('returns null when no draft is stored', () => {
    vi.stubGlobal('window', {})
    vi.stubGlobal('sessionStorage', createSessionStorageMock())

    expect(getUploadDraft()).toBeNull()
  })

  test('returns null for invalid JSON in storage', () => {
    vi.stubGlobal('window', {})
    vi.stubGlobal(
      'sessionStorage',
      createSessionStorageMock({ blood_test_upload_draft: 'not-json' }),
    )

    expect(getUploadDraft()).toBeNull()
  })

  test('returns null when stored draft is missing required fields', () => {
    vi.stubGlobal('window', {})
    vi.stubGlobal(
      'sessionStorage',
      createSessionStorageMock({
        blood_test_upload_draft: JSON.stringify({
          result: { testDate: '2026-03-25', biomarkers: [] },
          // sourceType and sourceFileName missing
        }),
      }),
    )

    expect(getUploadDraft()).toBeNull()
  })

  test('returns null when biomarkers is not an array', () => {
    vi.stubGlobal('window', {})
    vi.stubGlobal(
      'sessionStorage',
      createSessionStorageMock({
        blood_test_upload_draft: JSON.stringify({
          result: { testDate: '2026-03-25', biomarkers: 'not-an-array' },
          sourceType: 'csv',
          sourceFileName: 'report.csv',
        }),
      }),
    )

    expect(getUploadDraft()).toBeNull()
  })

  test('clearUploadDraft removes the stored draft', () => {
    const sessionStorage = createSessionStorageMock()
    vi.stubGlobal('window', {})
    vi.stubGlobal('sessionStorage', sessionStorage)

    saveUploadDraft(createDraft())
    clearUploadDraft()

    expect(sessionStorage.removeItem).toHaveBeenCalledWith('blood_test_upload_draft')
    expect(getUploadDraft()).toBeNull()
  })
})
