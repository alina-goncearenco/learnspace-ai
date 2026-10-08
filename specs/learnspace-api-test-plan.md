# LearnSpace API Test Plan

## Application Overview

Plan for lightweight contract-based API tests of GET /api/courses and POST /api/recommendations using Playwright APIRequestContext and service-object clients in tests/clients/. The API base URL is http://localhost:3001. Test specs belong under tests/api/ and reusable request examples under tests/data/. Coverage is limited to behavior documented in specs/learnspace-api-contract.md; there are no auth, persistence, performance, security-scanning, or external LLM tests.

## Test Scenarios

### 1. Courses API

**Seed:** `tests/api/courses-api.spec.ts`

#### 1.1. GET /api/courses returns the complete catalog

**File:** `tests/api/courses-api.spec.ts`

**Steps:**
  1. Use the CoursesApi client, backed by Playwright APIRequestContext, to send GET /api/courses to the documented API base URL.
    - expect: The response status is 200 OK.
    - expect: The response is JSON and has a root courses property that is an array.
  2. Validate the response catalog and its course records.
    - expect: Verify that courses is an array and contains the expected canonical course titles. Do not assert an exact catalog size, because the catalog may legitimately grow.
    - expect: Each course has id (number), title (string), category (string), level (string), description (string), and keywords (array of strings).
    - expect: Course IDs are unique within the returned catalog.
    - expect: The catalog includes the documented TypeScript Fundamentals example record with the expected field structure and values, without requiring a fixed course ID.
    - expect: The endpoint returns the complete catalog; no request parameters or request body are sent.

### 2. Recommendations API

**Seed:** `tests/api/recommendations-api.spec.ts`

#### 2.1. POST /api/recommendations recommends a course for a supported Python goal

**File:** `tests/api/recommendations-api.spec.ts`

**Steps:**
  1. Use the RecommendationsApi client, backed by Playwright APIRequestContext, to POST the data-driven prompt { "prompt": "I want to learn Python" } to /api/recommendations with JSON content type.
    - expect: The response status is 200 OK.
    - expect: The JSON response has a recommendations array.
    - expect: The array includes the documented Python for Data Analysis course.
    - expect: Each recommendation has the documented course fields and types: numeric id, string title/category/level/description, and string-array keywords.
    - expect: Each returned recommendation corresponds to a course in the catalog returned by GET /api/courses.

#### 2.2. POST /api/recommendations abstains for an unsupported topic

**File:** `tests/api/recommendations-api.spec.ts`

**Steps:**
  1. POST { "prompt": "I want to learn pottery" } through the RecommendationsApi client.
    - expect: The response status is 200 OK.
    - expect: The response JSON contains recommendations as an empty array.
    - expect: The response is treated as successful abstention, not as an HTTP error.

#### 2.3. POST /api/recommendations rejects a missing prompt

**File:** `tests/api/recommendations-api.spec.ts`

**Steps:**
  1. POST an empty JSON object through the RecommendationsApi client.
    - expect: The response status is 400 Bad Request.
    - expect: The JSON response contains error equal to "prompt must be a non-empty string".

#### 2.4. POST /api/recommendations rejects an empty prompt

**File:** `tests/api/recommendations-api.spec.ts`

**Steps:**
  1. POST { "prompt": "" } through the RecommendationsApi client.
    - expect: The response status is 400 Bad Request.
    - expect: The JSON response contains error equal to "prompt must be a non-empty string".

#### 2.5. POST /api/recommendations rejects a non-string prompt

**File:** `tests/api/recommendations-api.spec.ts`

**Steps:**
  1. Use one data-driven invalid-value case, such as a numeric prompt, and POST it through the RecommendationsApi client.
    - expect: The response status is 400 Bad Request because prompt must be a string.
    - expect: The JSON response contains error equal to "prompt must be a non-empty string".
