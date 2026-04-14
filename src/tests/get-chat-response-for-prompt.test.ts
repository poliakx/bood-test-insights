import { afterEach, describe, expect, test, vi } from 'vitest'
import { getChatResponseForPrompt } from '../services/integration/getChatResponseForPrompt'
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

function stubFetch(responseText: string) {
  return vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ response: responseText }),
    }),
  )
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

describe('getChatResponseForPrompt', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    delete process.env.NEXT_PUBLIC_AI_UNAVAILABLE
  })

  test('throws AI unavailable error when NEXT_PUBLIC_AI_UNAVAILABLE is 1', async () => {
    process.env.NEXT_PUBLIC_AI_UNAVAILABLE = '1'

    await expect(getChatResponseForPrompt('summary')).rejects.toThrow('AI unavailable')
  })

  test('does not throw when NEXT_PUBLIC_AI_UNAVAILABLE is unset', async () => {
    vi.stubGlobal('window', {})
    vi.stubGlobal('localStorage', createLocalStorageMock())
    vi.stubGlobal('fetch', stubFetch('all good'))

    await expect(getChatResponseForPrompt('summary')).resolves.toBe('all good')
  })

  test('returns response text from the chat API', async () => {
    vi.stubGlobal('window', {})
    vi.stubGlobal('localStorage', createLocalStorageMock())
    vi.stubGlobal('fetch', stubFetch('Glucose is within normal range.'))

    const result = await getChatResponseForPrompt('What is my glucose?')
    expect(result).toBe('Glucose is within normal range.')
  })

  test('sends totalResults: 0 in context when storage is empty', async () => {
    vi.stubGlobal('window', {})
    vi.stubGlobal('localStorage', createLocalStorageMock())

    const fetchMock = stubFetch('no data')
    vi.stubGlobal('fetch', fetchMock)

    await getChatResponseForPrompt('summary')

    const [, options] = fetchMock.mock.calls[0]
    const body = JSON.parse((options as RequestInit).body as string) as {
      context: { totalResults: number }
    }
    expect(body.context.totalResults).toBe(0)
  })

  test('sends stored results as context to the API', async () => {
    const result = createResult('r1')
    vi.stubGlobal('window', {})
    vi.stubGlobal(
      'localStorage',
      createLocalStorageMock({ blood_test_results: JSON.stringify([result]) }),
    )

    const fetchMock = stubFetch('response')
    vi.stubGlobal('fetch', fetchMock)

    await getChatResponseForPrompt('summary')

    const [, options] = fetchMock.mock.calls[0]
    const body = JSON.parse((options as RequestInit).body as string) as {
      prompt: string
      context: { totalResults: number }
    }
    expect(body.prompt).toBe('summary')
    expect(body.context.totalResults).toBe(1)
  })
})
