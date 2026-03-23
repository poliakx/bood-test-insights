import { mockExtractResults } from '../services/extraction/mockExtractResults'

test('mock extraction returns results', async () => {
  const results = await mockExtractResults()
  expect(results.length).toBeGreaterThan(0)
})
