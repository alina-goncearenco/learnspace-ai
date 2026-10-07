# LearnSpace API Contract

## Overview

The LearnSpace API provides course catalog data and course recommendations.

Base URL:

```text
http://localhost:3001
```

## GET /api/courses

Returns the complete course catalog.

### Request

```http
GET /api/courses
```

No parameters or request body.

### Successful response

**Status:** `200 OK`

```json
{
  "courses": [
    {
      "id": 1,
      "title": "TypeScript Fundamentals",
      "category": "Programming",
      "level": "Beginner",
      "description": "Learn types, interfaces, functions and practical TypeScript.",
      "keywords": [
        "typescript",
        "programming",
        "code",
        "javascript",
        "automation"
      ]
    }
  ]
}
```

The response contains the complete course catalog. The current catalog contains 8 courses.

Each course contains:

* `id` — number
* `title` — string
* `category` — string
* `level` — string
* `description` — string
* `keywords` — array of strings

## POST /api/recommendations

Returns course recommendations based on a learning goal.

### Request

```http
POST /api/recommendations
Content-Type: application/json
```

Request body:

```json
{
  "prompt": "I want to learn Python"
}
```

### Successful response

**Status:** `200 OK`

```json
{
  "recommendations": [
    {
      "id": 2,
      "title": "Python for Data Analysis",
      "category": "Programming",
      "level": "Intermediate",
      "description": "Explore Python, data structures and data analysis.",
      "keywords": [
        "python",
        "data",
        "programming",
        "analysis"
      ]
    }
  ]
}
```

The `recommendations` array may contain zero or more course objects.

For unsupported learning goals, the endpoint returns a successful response with an empty array.

Example:

```json
{
  "recommendations": []
}
```

### Validation

The `prompt` property is required and must be a non-empty string.

Invalid request:

```json
{}
```

Response:

**Status:** `400 Bad Request`

```json
{
  "error": "prompt must be a non-empty string"
}
```

An empty string is also invalid.

## Current API behavior

The recommendation logic is deterministic and uses the same course data and recommendation logic as the LearnSpace UI.

Verified behaviors:

| Scenario                          | Expected result                  |
| --------------------------------- | -------------------------------- |
| Python learning goal              | Returns Python for Data Analysis |
| Unsupported topic such as pottery | Returns empty recommendations    |
| Missing `prompt`                  | Returns HTTP 400                 |
| Empty `prompt`                    | Returns HTTP 400                 |

## Out of scope

The current API does not include:

* Authentication or authorization
* Database persistence
* Pagination
* Rate limiting
* External AI/LLM calls
* Course enrollment
* Course detail endpoints
