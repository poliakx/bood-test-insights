# Blood Test Insights

Blood Test Insights is a lightweight web app for uploading blood test files, reviewing extracted biomarker data, storing historical results, visualizing trends, and asking contextual questions in chat.

## 1. Project overview

This product helps users move from raw blood test files to usable insights in one end-to-end flow:

1. Upload a file (CSV, PDF, image)
2. Review extracted biomarkers
3. Save a cleaned result to history
4. Track biomarker trends over time
5. Ask contextual questions against saved data

The goal of this MVP is practical usability: a clear workflow with sensible validation, persistence, and trend/chat support.

## 2. Features

- Upload blood test files
- Review extracted biomarkers before saving
- Save result history locally in browser storage
- Visualize biomarker trends with line charts
- Ask contextual questions in chat based on saved results

## 3. Tech stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Zod (schema validation)
- Recharts (trend charting)
- Vitest (unit tests)
- React Testing Library (planned for component-level testing)

## 4. Architecture

### UI layer

- Route-level page composition under src/app
- Reusable feature components under src/components
- Stateful UI hooks for history and chat flows

### Services

- Extraction service for source detection and extraction pipeline
- Storage service for saving/loading validated results
- Chat services for context building and deterministic response generation

### Domain modeling

- Strong blood-test domain types under src/features/blood-test/types.ts
- Zod schemas under src/features/blood-test/schemas.ts for runtime validation
- Mapper helpers for raw-to-domain transformation

### Persistence

- Browser localStorage via src/services/storage/resultsStorage.ts
- Central key-based read/write with validation on retrieval

## 5. Trade-offs

- PDF/image extraction is mocked in this MVP
- Persistence is local-only (no backend sync)
- Chat is contextual and rule-based, not a medical LLM
- Focus was on end-to-end usability over full diagnostic realism

## 6. Running locally

Prerequisites:

- Node.js 20+
- npm 10+

Setup and run:

```bash
npm install
npm run dev
```

Open:

- http://localhost:3000
- Main workflow page: http://localhost:3000/upload

Optional checks:

```bash
npm run build
npm run lint
```

## 7. Tests

Run unit tests:

```bash
npm test
```

Current suite covers:

- Trend data building logic
- Chat response generation paths
- Storage behavior and validation fallback
- Extraction and mapping helpers

## 8. AI usage note

AI tools were used primarily to speed up UI scaffolding, component structuring, and implementation exploration for upload flow, validation, and contextual chat behavior.

## 9. AI usage details

Generated code was manually reviewed and refined. The domain model was tightened, over-complex suggestions were simplified, and state management plus validation flows were adjusted to match MVP scope.

Main AI limitations observed during implementation:

- Occasional overengineering for simple UI tasks
- Inconsistent assumptions around MVP boundaries

These were corrected through manual review and iterative validation.
