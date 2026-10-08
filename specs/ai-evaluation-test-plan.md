# Proposed Test Plan: LearnSpace AI Evaluation

## Goal and scope

Create a small, browser-free evaluation layer for recommendation behavior. The contract describes the desired behavior of an AI-powered assistant, but the current LearnSpace assistant is deterministic keyword matching, not a live LLM.

The evaluation uses controlled simulated outputs to verify that the evaluator detects correct and incorrect behavior. Simulated outputs validate the evaluation machinery; they do **not** demonstrate the quality of a live model. When a model-backed implementation exists, a provider layer can be introduced later to isolate model-specific integration from the evaluation logic without changing the evaluation case format.

Keep this layer separate from UI E2E tests and API contract tests.

## Proposed organization

```text
tests/
├── ai/
│   ├── ai-evaluation.spec.ts
│   ├── evaluator.ts
│   └── data/
│       ├── evaluation-cases.ts
│       └── simulated-responses.ts
├── data/
│   └── learnspace-test-data.ts
└── types/
    └── api.ts
```

- `tests/ai/data/evaluation-cases.ts` holds prompts, expected relevant titles, abstention expectations, and constraints such as a required top result.
- `tests/ai/data/simulated-responses.ts` holds controlled good and intentionally bad AI outputs used to verify that the evaluation logic can detect known failure modes.
- `tests/ai/evaluator.ts` contains small, deterministic checks for catalog membership, relevance, abstention, ranking, and the maximum of three recommendations.
- `tests/ai/ai-evaluation.spec.ts` is a Playwright Test spec using a dedicated browser-free AI evaluation project. It should not use the page fixture or launch a browser.
- Reuse `courseTitles` from `tests/data/learnspace-test-data.ts` for every expected course name. Do not create another list of course-title strings.
- Do not add a recommendation-provider/adapter abstraction at this stage. The project does not currently have a live LLM integration, so a provider abstraction would add unnecessary complexity. A provider layer can be introduced later if a real model-backed implementation is added.

The evaluation can use in-memory catalog data or import the existing course-data source directly. It should not call the API unless the evaluation explicitly needs to validate catalog/API consistency; that is already covered by API tests.

## Implementation constraints

Keep the AI evaluation implementation intentionally small and focused on demonstrating AI-testing practices.

Do not:

- modify the LearnSpace application code
- introduce a live LLM or external model provider
- introduce a database, authentication, or additional infrastructure
- create a generic provider/adapter abstraction for a future model
- duplicate the course catalog or course-title constants
- replace deterministic evaluation with LLM-as-a-judge

The current simulated responses are test fixtures used to validate the evaluation machinery. They must not be presented as evidence of real model quality.

## Evaluation cases

| Case | Prompt and expected behavior | Evaluation focus |
|---|---|---|
| Supported Python goal | “I want to learn Python for data analysis.” Recommend `courseTitles.pythonForDataAnalysis`. | Relevance |
| Supported Playwright goal | “I want to learn browser automation with Playwright.” Recommend `courseTitles.advancedPlaywright` first. Broader testing courses may appear later if included. | Relevance, ranking |
| Supported API-testing goal | “I want to learn how to test APIs.” Recommend `courseTitles.apiTestingFundamentals`. | Relevance |
| Unsupported goal | “I want to learn pottery.” Return no recommendations. | Abstention |
| Irrelevant but catalog-backed output | For the Python prompt, return `courseTitles.leadershipEssentials`. It exists in the catalog, but is unrelated to the request. The evaluator should flag relevance failure while recognizing that the result is grounded. | Relevance; negative case |
| Invented output | For the Python prompt, return a recommendation with a title such as “Pottery Fundamentals” that does not correspond to a catalog entry. The evaluator should flag groundedness failure. | Groundedness; negative case |
| Too many recommendations | For a broad supported prompt, return four catalog-backed recommendations. The evaluator should flag the result even if every course is grounded and relevant. | Maximum recommendation limit; negative case |
| Incorrect ranking | For the Playwright prompt, put a broader testing course before `courseTitles.advancedPlaywright`. The evaluator should flag a ranking failure. | Ranking; negative case |

The negative cases are deliberately controlled evaluator inputs. They verify that the evaluation logic can identify known failures; they do not require the production assistant to produce those failures on demand.

## Assertions and pass criteria

Use deterministic assertions wherever the expected behavior can be labeled clearly:

- **Groundedness:** Every returned recommendation maps to an entry in the catalog. For structured course objects, compare the stable course identity against catalog records; for title-based fixtures, compare against catalog titles.
- **Relevance:** A supported prompt includes at least one case-labeled relevant course.
- **Abstention:** An unsupported prompt returns zero recommendations.
- **Ranking:** When a case specifies a preferred course, it appears before less relevant results; for the Playwright case, `courseTitles.advancedPlaywright` must be first.
- **Recommendation limit:** The result contains no more than three recommendations.

A case passes only when all of its required checks pass. The evaluator should report failures by case and criterion—for example, “groundedness failure: recommendation not found in catalog”—rather than hiding or normalizing invalid output.

For the controlled negative fixtures, success means the evaluator correctly identifies the intended failure. For example, the invented-course fixture should fail the groundedness check. These evaluator self-checks must not be described as evidence that the assistant itself behaves correctly.

## Deterministic checks versus rubric-based assessment

The small initial suite should use deterministic labels and assertions. Exact expected course titles, catalog membership, abstention, ordering for explicitly ranked cases, and the three-item limit are objective and suitable for regular Playwright Test runs.

A future real LLM may produce semantically relevant recommendations that do not match an exact title expectation, or may include natural-language explanations. Assessing paraphrased intent, nuanced relevance, ambiguous prompts, and whether explanation claims are supported may require a rubric-based review or an LLM-as-judge. Such results should be reported separately from deterministic pass/fail checks, with the rubric, examples, and acceptance thresholds made explicit. They should not replace the contract’s exact groundedness and recommendation-limit requirements.

For this initial portfolio implementation, LLM-as-a-judge is intentionally out of scope. The evaluation should demonstrate the architecture and principles of AI evaluation using deterministic fixtures. A future model-backed implementation could add rubric-based or LLM-as-a-judge evaluation as a separate layer without replacing the deterministic checks.

## Execution separation

Run the evaluation as a browser-free Playwright Test project that matches `tests/ai/**/*.spec.ts`. Keep those files excluded from Chromium, Firefox, and WebKit projects. The evaluation specs should rely on the evaluation fixtures and should not require UI navigation or browser APIs.

Run the evaluation explicitly through the `ai-eval` Playwright project for selective local execution. The full Playwright run can include the AI evaluation project along with the existing UI and API projects. CI workflow changes are not part of this proposal.