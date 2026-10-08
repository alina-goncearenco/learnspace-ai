# LearnSpace AI Evaluation Contract

## Purpose

The Learning Assistant recommends courses based on a learner's natural-language learning goal.

The current LearnSpace implementation uses deterministic keyword matching. This contract describes the expected behavior of an AI-powered version of the feature and provides the basis for AI evaluation tests.

## Input

The assistant receives a learner prompt as natural-language text.

Examples:

- "I want to learn Python for data analysis"
- "I want to learn browser automation with Playwright"
- "I want to learn how to test APIs"
- "I want to learn pottery"

## Output

The assistant returns zero or more course recommendations.

Each recommendation must correspond to a course that exists in the LearnSpace course catalog.

The assistant may return a maximum of 3 recommendations.

## Evaluation Criteria

### 1. Relevance

Recommendations should be relevant to the learner's stated learning goal.

For example:

- Python for data analysis → Python for Data Analysis
- Browser automation with Playwright → Advanced Playwright
- API testing → API Testing Fundamentals

An unrelated course should be considered a relevance failure.

### 2. Groundedness

Every recommended course must exist in the LearnSpace course catalog.

The assistant must not invent courses or recommend courses that are not present in the catalog.

### 3. Abstention

When the catalog does not contain a suitable course for the learner's request, the assistant should return no recommendations rather than inventing or forcing a match.

Example:

- "I want to learn pottery" → no recommendations

### 4. Ranking

When multiple courses are relevant, the most relevant course should appear before less relevant courses.

For example, a request specifically about browser automation with Playwright should prioritize:

1. Advanced Playwright

over broader testing courses.

### 5. Recommendation Limit

The assistant must return no more than 3 recommendations.

## Evaluation Approach

AI evaluation should focus on behavioral quality rather than exact response text.

Evaluation cases should cover:

- supported learning goals
- unsupported learning goals
- unrelated recommendations
- invented/ungrounded courses
- multiple relevant recommendations
- recommendation ordering
- recommendation limit

The evaluation layer should be independent from UI tests.

The evaluation should not require a browser.

## Out of Scope

The AI evaluation does not cover:

- UI rendering
- navigation
- browser interaction
- authentication
- enrollment
- course completion
- model latency
- infrastructure availability
- model provider-specific implementation details