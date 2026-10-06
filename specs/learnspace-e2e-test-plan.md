# LearnSpace Prioritized End-to-End Test Plan

## Application Overview

# Scope and observed application
LearnSpace is a React + TypeScript course discovery app with an eight-course catalog, text search, category filters, course cards, and a Learning Assistant. The assistant is explicitly a local keyword-matching demo rather than a live LLM. Observed user-facing behaviors: searching `python` returns Python for Data Analysis; combining `python` with category `Data` returns zero courses; selecting `All` restores the search result; `browser automation` returns Advanced Playwright, API Testing Fundamentals, and TypeScript Fundamentals; an uncommon unmatched string shows a no-match message; a natural-language `pottery` prompt unexpectedly returned unrelated courses; submitting an empty assistant prompt produced no visible feedback; returning from the assistant retained the previous catalog search and selected category; and a course-card recommendation action opened an empty assistant prompt with no course context.

# Priority guide
P0 blocks the primary course-discovery and recommendation journeys. P1 covers important recovery, validation, and cross-view behavior. P2 covers lower-frequency robustness and state-retention expectations. Run each scenario from a fresh page state unless its steps establish state explicitly.

# Important edge cases
Cover empty and whitespace-only search and assistant prompts, mixed case and punctuation, partial terms, multi-keyword prompts, ambiguous/common words, typo or uncommon-word prompts, repeated submissions, Enter versus Send, search plus category intersection, zero-result recovery, clearing filters/search, and opening a recommendation from a filtered card. In particular, investigate why `I want to learn pottery` returns unrelated cards while a nonsense token string correctly reaches the fallback.

# Testability gaps and contracts to clarify
The assistant currently has no live model or network dependency, which makes its existing keyword behavior deterministic and well-suited to ordinary Playwright assertions. Empty submission has no visible validation or confirmation; define whether Send should be disabled or a prompt should be shown. Recommendation relevance/order and keyword matching boundaries are undocumented, and natural-language false positives are possible. The card action currently opens a blank assistant without carrying course context; decide whether that is intended. Specify whether catalog search/filter state should persist when switching views. The app has no distinct course detail/enrollment journey in the observed scope. Prefer role/label and visible-text assertions, and keep recommendation actions scoped to their enclosing course card if identical buttons are present.

# Deterministic Playwright regression candidates
Catalog initial count/content, category filtering, search results, combined search/filter behavior and recovery, assistant response for fixed keywords, empty/no-match handling once expected validation is agreed, card-to-assistant transition, and navigation state behavior are deterministic while the catalog and keyword matcher remain local and static. Use fresh-page preconditions and assert user-visible cards/messages, not internal state.

# Future AI/LLM evaluation candidates
If the assistant later uses an LLM, evaluate semantic intent matching across paraphrases and realistic learning goals, recommendation relevance and ranking, groundedness in the current catalog, abstention for unsupported goals, and robustness to typos or ambiguous prompts. Use a curated prompt set with human/rubric-based scoring and controlled model/version tracking; do not require exact generated wording in ordinary E2E regression tests.

## Test Scenarios

### 1. Core user journeys

**Seed:** ``

#### 1.1. [P0] Browse the catalog and filter by category

**File:** `proposed-tests/catalog-category-filter.spec.ts`

**Steps:**
  1. Open the app from a fresh page and inspect the course catalog.
    - expect: The catalog displays eight courses and each course card has a title, category, level, description, and recommendation action.
  2. Select the Programming category, then select All.
    - expect: Programming courses are shown while the filter is active; selecting All restores the complete eight-course catalog.
  3. Priority: P0. Why: Establishes that users can discover the catalog and narrow it using its primary navigation control. Validate visible catalog content, not implementation details.
    - expect: This test is valuable because broken catalog loading or category filtering blocks the central discovery journey.

#### 1.2. [P0] Search for a course and recover to the full catalog

**File:** `proposed-tests/course-search.spec.ts`

**Steps:**
  1. From a fresh page, enter `python` in Search courses.
    - expect: The count updates to one course and Python for Data Analysis is visible.
  2. Replace the query with `PYTHON`, then clear the search field.
    - expect: Search is case-insensitive and clearing the query restores the unfiltered catalog of eight courses.
  3. Priority: P0. Why: Search is a primary way for users to find a specific learning option and recover to broader browsing.
    - expect: The course result is correct for both letter cases, and clearing search does not leave the catalog stuck in a narrowed state.

#### 1.3. [P1] Combine search and category filters, then recover from zero results

**File:** `proposed-tests/search-category-composition.spec.ts`

**Steps:**
  1. Search for `python` and select the Data category.
    - expect: The result count becomes zero and a clear no-courses-found message appears.
  2. Select All while keeping the search query, then clear the query.
    - expect: The Python for Data Analysis result returns after selecting All; clearing search restores all courses.
  3. Priority: P1. Why: Users commonly combine discovery controls and need a clear, reversible way out of an empty result set.
    - expect: Filters behave as a predictable intersection and removing a constraint restores matching courses.

#### 1.4. [P0] Get recommendations for a supported learning goal

**File:** `proposed-tests/assistant-keyword-recommendation.spec.ts`

**Steps:**
  1. Open Learning assistant from a fresh page, enter `I want to learn browser automation`, and submit with Enter.
    - expect: The user's request is accepted and recommendations appear without a page error.
  2. Inspect the suggested course cards.
    - expect: Advanced Playwright appears, along with the current keyword-match suggestions API Testing Fundamentals and TypeScript Fundamentals; no unrelated catalog content replaces these results.
  3. Submit the same prompt using the Send button in a fresh assistant session.
    - expect: The Send-button route also submits the prompt and presents recommendations.
  4. Priority: P0. Why: Matching a learner's goal to useful courses is the app's defining assistant journey.
    - expect: A known supported goal returns the expected user-visible recommendation set using both available submission methods.

#### 1.5. [P1] Handle an assistant prompt with no matching catalog terms

**File:** `proposed-tests/assistant-no-match.spec.ts`

**Steps:**
  1. Open the assistant from a fresh page and submit `qzxw plmokn flibbertigibbet`.
    - expect: A clear no-match message appears and no course recommendation cards are shown.
  2. Enter a supported prompt such as `SQL` after the fallback.
    - expect: The user can submit another prompt and receive matching recommendations without restarting the app.
  3. Priority: P1. Why: Honest fallback and recovery prevent users from mistaking irrelevant courses for useful advice.
    - expect: Unmatched requests produce the fallback state; subsequent valid requests still work.

#### 1.6. [P1] Prevent silent empty assistant submissions

**File:** `proposed-tests/assistant-empty-prompt.spec.ts`

**Steps:**
  1. Open the assistant from a fresh page and submit an empty prompt with Send.
    - expect: No empty user message or recommendations are added; the interface gives clear validation feedback or keeps Send unavailable.
  2. Enter only spaces and submit using Enter.
    - expect: Whitespace-only input is treated as empty and does not create a conversation turn.
  3. Priority: P1. Why: Users can submit accidentally, and silent behavior leaves them unsure whether the assistant is working.
    - expect: Empty and whitespace-only input is consistently rejected with an understandable user-visible outcome.

#### 1.7. [P1] Start a relevant assistant journey from a course card

**File:** `proposed-tests/course-card-recommendation-entry.spec.ts`

**Steps:**
  1. From a fresh catalog page, locate the Python for Data Analysis card and activate its Get a recommendation action.
    - expect: The Learning Assistant opens.
  2. Inspect the prompt and recommendations, then submit or continue the course-related journey.
    - expect: The selected course context is either carried into a relevant assistant response or the interface clearly explains that the action starts a generic recommendation request. The observed current behavior opens with a blank prompt and no contextual response, so agree on the intended contract before turning this assertion into a gate.
  3. Priority: P1. Why: The card action promises a contextual next step and should not strand users in an unexplained blank assistant.
    - expect: The transition is clear and useful, with selected-course context handled consistently.

#### 1.8. [P2] Preserve a user's catalog state when returning from the assistant

**File:** `proposed-tests/catalog-state-navigation.spec.ts`

**Steps:**
  1. Search for `python`, select Data to create a zero-result state, and open Learning assistant.
    - expect: The assistant view opens.
  2. Use Back to courses.
    - expect: The catalog returns with the same query and category selection, showing the same zero-result state, or follows an explicitly documented reset behavior. Current observed behavior retains both.
  3. Priority: P2. Why: State retention affects navigation continuity but is secondary to successful discovery and recommendations.
    - expect: The view transition follows a deliberate, repeatable state-retention contract.

#### 1.9. [P2] Reject unrelated natural-language prompts rather than returning false matches

**File:** `proposed-tests/assistant-ambiguous-unmatched-prompt.spec.ts`

**Steps:**
  1. From a fresh assistant session, submit `I want to learn pottery`.
    - expect: The assistant should not present unrelated courses as relevant; it should return a no-match or clarification response. Current observed behavior returned unrelated courses, so first confirm the intended matching contract and treat this as a defect-discovery scenario.
  2. Try a supported prompt with an unambiguous keyword such as `Python`.
    - expect: Supported catalog-related terms still return relevant course cards.
  3. Priority: P2. Why: Common filler words and unrelated goals can create misleading false positives in keyword matching.
    - expect: Unrelated prompts do not produce misleading recommendations, while known catalog goals remain discoverable.
