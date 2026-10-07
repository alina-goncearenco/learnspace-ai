# LearnSpace — AI Learning Assistant QA Lab

LearnSpace is a small learning-platform demo built to demonstrate modern
QA/SDET practices across UI, API, and AI-oriented testing.

## Project overview

The application includes a course catalog with category filtering and search, a
Learning Assistant recommendation feature, and a lightweight API layer. The
assistant currently uses deterministic keyword matching; it is not connected to
a live LLM.

## QA and testing architecture

```text
LearnSpace
├── UI
│   └── Playwright E2E tests
├── API
│   └── Playwright API tests
└── AI
    └── AI evaluation prototype / planned evaluation layer
```

UI tests exercise the application through the browser. API tests use Playwright
`APIRequestContext` through reusable API clients. The planned AI evaluation
layer is intended to assess AI/LLM-style behavior separately from UI and API
functional testing; the current assistant is deterministic keyword matching,
not an LLM.

Test code is organized by responsibility:

| Path | Purpose |
| --- | --- |
| `tests/pages/` | UI Page Objects |
| `tests/clients/` | Reusable API clients |
| `tests/api/` | API tests |
| `tests/data/` | Shared test data |
| `tests/types/` | Shared API test types |
| `specs/` | API contracts and test plans |

## Test coverage

The current suite covers:

- UI catalog, search, and category-filter behavior
- Learning Assistant recommendations, no-match behavior, and regression coverage for unrelated-topic recommendations
- API catalog contract, recommendation behavior, and negative/validation cases
- Consistency between recommendation results and the current catalog
- UI execution in Chromium, Firefox, and WebKit
- Dedicated API execution without launching a browser

## Running tests

```sh
# Full suite
npm test

# UI only
npm run test:ui

# API only
npm run test:api
```

The `@ui` and `@api` tags allow selective local execution. API tests run in the
dedicated Playwright API project and do not launch a browser. Playwright manages
the API server lifecycle, so there is no need to run `npm run api` manually.
The normal full-suite command runs both UI and API tests.

## CI

GitHub Actions builds the application before testing and runs the complete
Playwright suite. CI intentionally does not use the UI/API subset commands.

## Project status / next step

The next planned testing layer is AI evaluation: assessing relevance,
grounding, abstention, ranking, and robustness for AI-style responses. This
will evaluate the deterministic assistant honestly and will not treat it as a
live LLM.
