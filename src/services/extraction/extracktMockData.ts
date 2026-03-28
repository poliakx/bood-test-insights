import { MOCK_BLOOD_TEST_RESULTS } from "../../mocks/mockExtractResults";
import type { PreviewBiomarker, UploadPreviewResult } from "@/features/blood-test/types";

export function extractMockData(): UploadPreviewResult {
  return {
    testDate: MOCK_BLOOD_TEST_RESULTS[0].testDate,
    biomarkers: MOCK_BLOOD_TEST_RESULTS[0].biomarkers.map(
      (b): PreviewBiomarker => ({
        id: b.id,
        name: b.name,
        value: b.value,
        unit: b.unit,
        referenceRange: b.referenceRange,
      }),
    ),
  };
}