# LearnSpace — AI Learning Assistant QA Lab

LearnSpace is a small learning platform and QA/SDET portfolio project
demonstrating test practices across UI, API, and AI evaluation layers. The
Learning Assistant currently uses deterministic keyword matching; it is not
backed by a live LLM.

## Project overview

The application provides a course catalog, category filtering, course search,
Learning Assistant recommendations, and a lightweight REST API for courses
and recommendations.

## QA and testing architecture

```text
LearnSpace
├── UI
│   └── Playwright E2E tests
├── API
│   └── Playwright API tests
└── AI
    └── Browser-free deterministic AI evaluation
```

The layers separate UI functional testing, API/service testing, and AI behavior
evaluation. UI tests exercise the app in a browser. API tests use Playwright
`APIRequestContext` through reusable API clients. The AI evaluation is a
prototype using simulated responses—not a live LLM integration.

### UI testing

UI tests cover course search and category filtering, supported Learning
Assistant recommendations, no-match behavior, case-insensitive matching,
recommendation specificity, and regression coverage for unrelated-topic
recommendations. They run in Chromium, Firefox, and WebKit. UI Page Objects are
in `tests/pages/`.

### API testing

The lightweight Express API exposes:

- `GET /api/courses`
- `POST /api/recommendations`

Playwright API tests check response structure and validation, invalid request
handling, unsupported-topic abstention, and consistency between recommendations
and the current catalog. Reusable API clients are in `tests/clients/`; endpoint
tests are in `tests/api/`. The API has no authentication, database, external
service, or live AI model.

### AI evaluation

This browser-free evaluation prototype uses simulated AI responses to
demonstrate deterministic evaluation methodology without an external model or
API. The evaluator checks:

- **Relevance:** recommendations match the labeled learning goal.
- **Groundedness:** every recommended course must exist in the LearnSpace
  course catalog.
- **Abstention:** unsupported requests should return no recommendations.
- **Ranking:** an expected top recommendation appears first.
- **Recommendation limit:** a response contains no more than three courses.

Controlled bad fixtures verify detection of irrelevant catalog-backed
recommendations, invented courses, failure to abstain, incorrect ranking, and
an over-limit response. These fixtures test the evaluator; they do not
represent failures of a live production LLM. Controlled bad fixtures verify detection of irrelevant catalog-backed recommendations, invented courses, failure to abstain, incorrect ranking, and an over-limit response. These fixtures test the evaluator; they do not represent failures of a live production LLM. AI
evaluation tests run without a browser in the dedicated Playwright `ai-eval`
project.

```text
tests/ai/
├── ai-evaluation.spec.ts
├── evaluator.ts
└── data/
    ├── evaluation-cases.ts
    └── simulated-responses.ts
```

## Test organization

```text
tests/
├── pages/      # UI Page Objects
├── clients/    # API clients
├── api/        # API tests
├── ai/         # AI evaluation tests
├── data/       # Shared test data
└── types/      # Shared API types

specs/
├── learnspace-e2e-test-plan.md
├── learnspace-api-contract.md
├── learnspace-api-test-plan.md
└── ai-evaluation-test-plan.md
```

This separation keeps browser behavior, HTTP contracts, and deterministic
recommendation evaluation focused and independently runnable.

## Running tests

```sh
npm test
npm run test:ui
npm run test:api
npm run test:ai
npm run build
```

- `npm test` — full UI, API, and AI evaluation suite
- `npm run test:ui` — UI tests
- `npm run test:api` — API tests
- `npm run test:ai` — browser-free AI evaluation tests
- `npm run build` — production build

The dedicated Playwright projects support selective execution of UI, API, and AI evaluation tests. 

## CI

GitHub Actions builds the application and runs the complete Playwright suite,
including UI, API, and AI evaluation tests. CI runs the full suite rather than
the local subset commands. The workflow does not deploy the application.

## QA approach and next step

The project demonstrates test planning before implementation, the Page Object
Model, API client/service objects, shared test data, API contract checks,
cross-layer catalog consistency, cross-browser UI coverage, browser-free
deterministic AI evaluation, CI automation, and defect-driven testing. For
example, the unrelated “pottery” prompt exposed an overly broad recommendation
matching defect; the application logic was corrected before the regression
test passed.

If the assistant is later backed by a real LLM, evaluation could be extended to
assess relevance, groundedness, abstention, ranking, robustness/consistency,
and safety/policy behavior. Those qualities are not currently evaluated
against a live model.
