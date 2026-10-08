import type { EvaluationCase } from './data/evaluation-cases';
import type { SimulatedResponse } from './data/simulated-responses';

export type EvaluationResult = {
  prompt: string;
  relevant: boolean;
  grounded: boolean;
  abstainedCorrectly: boolean;
  rankingCorrect: boolean;
  withinRecommendationLimit: boolean;
  passed: boolean;
};

export type EvaluationCriterion =
  | 'relevant'
  | 'grounded'
  | 'abstainedCorrectly'
  | 'rankingCorrect'
  | 'withinRecommendationLimit';

export function evaluateResponse(
  testCase: EvaluationCase,
  response: SimulatedResponse,
  catalogTitles: readonly string[],
): EvaluationResult {
  const recommendations = response.recommendations;

  const relevant =
    testCase.relevantCourses.length === 0
      ? recommendations.length === 0
      : recommendations.length > 0 &&
        recommendations.every((course) =>
          testCase.relevantCourses.includes(course),
        );

  const grounded = recommendations.every((course) =>
    catalogTitles.includes(course),
  );

  const abstainedCorrectly = testCase.shouldAbstain
    ? recommendations.length === 0
    : recommendations.length > 0;
  const rankingCorrect =
    !testCase.expectedTopCourse ||
    recommendations[0] === testCase.expectedTopCourse;
  const withinRecommendationLimit = recommendations.length <= 3;

  const passed =
    relevant &&
    grounded &&
    abstainedCorrectly &&
    rankingCorrect &&
    withinRecommendationLimit;

  return {
    prompt: testCase.prompt,
    relevant,
    grounded,
    abstainedCorrectly,
    rankingCorrect,
    withinRecommendationLimit,
    passed,
  };
}