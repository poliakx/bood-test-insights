import { BloodTestResult } from '../../features/blood-test/types'

const NOW = new Date('2026-03-20T09:30:00.000Z')

export const MOCK_BLOOD_TEST_RESULTS: BloodTestResult[] = [
  {
    id: 'result-2026-03-20',
    userId: 'demo-user',
    date: '2026-03-20T09:00:00.000Z',
    createdAt: NOW.toISOString(),
    sourceType: 'pdf',
    sourceFileUrl: 'https://example.com/mock-results/march-2026.pdf',
    status: 'reviewed',
    biomarkers: [
      {
        id: 'hb-2026-03-20',
        name: 'Hemoglobin',
        value: 13.6,
        unit: 'g/dL',
        referenceRange: { min: 12, max: 16 },
        date: '2026-03-20T09:00:00.000Z',
        flag: 'normal',
      },
      {
        id: 'wbc-2026-03-20',
        name: 'WBC',
        value: 6.2,
        unit: '10^9/L',
        referenceRange: { min: 4, max: 11 },
        date: '2026-03-20T09:00:00.000Z',
        flag: 'normal',
      },
      {
        id: 'plt-2026-03-20',
        name: 'Platelets',
        value: 248,
        unit: '10^9/L',
        referenceRange: { min: 150, max: 400 },
        date: '2026-03-20T09:00:00.000Z',
        flag: 'normal',
      },
    ],
  },
  {
    id: 'result-2026-02-14',
    userId: 'demo-user',
    date: '2026-02-14T08:45:00.000Z',
    createdAt: '2026-02-14T09:15:00.000Z',
    sourceType: 'image',
    sourceFileUrl: 'https://example.com/mock-results/february-2026.jpg',
    status: 'processed',
    biomarkers: [
      {
        id: 'hb-2026-02-14',
        name: 'Hemoglobin',
        value: 12.9,
        unit: 'g/dL',
        referenceRange: { min: 12, max: 16 },
        date: '2026-02-14T08:45:00.000Z',
        flag: 'normal',
      },
      {
        id: 'wbc-2026-02-14',
        name: 'WBC',
        value: 11.4,
        unit: '10^9/L',
        referenceRange: { min: 4, max: 11 },
        date: '2026-02-14T08:45:00.000Z',
        flag: 'high',
      },
      {
        id: 'plt-2026-02-14',
        name: 'Platelets',
        value: 189,
        unit: '10^9/L',
        referenceRange: { min: 150, max: 400 },
        date: '2026-02-14T08:45:00.000Z',
        flag: 'normal',
      },
    ],
  },
  {
    id: 'result-2026-01-09',
    userId: 'demo-user',
    date: '2026-01-09T10:10:00.000Z',
    createdAt: '2026-01-09T10:30:00.000Z',
    sourceType: 'manual',
    status: 'pending',
    biomarkers: [
      {
        id: 'hb-2026-01-09',
        name: 'Hemoglobin',
        value: 11.8,
        unit: 'g/dL',
        referenceRange: { min: 12, max: 16 },
        date: '2026-01-09T10:10:00.000Z',
        flag: 'low',
      },
      {
        id: 'wbc-2026-01-09',
        name: 'WBC',
        value: 5.8,
        unit: '10^9/L',
        referenceRange: { min: 4, max: 11 },
        date: '2026-01-09T10:10:00.000Z',
        flag: 'normal',
      },
      {
        id: 'plt-2026-01-09',
        name: 'Platelets',
        value: 142,
        unit: '10^9/L',
        referenceRange: { min: 150, max: 400 },
        date: '2026-01-09T10:10:00.000Z',
        flag: 'low',
      },
    ],
  },
]

export async function mockExtractResults(): Promise<BloodTestResult[]> {
  return MOCK_BLOOD_TEST_RESULTS
}
