import { expect, test } from '@playwright/test';
import { courses } from '../../src/data/courses';
import { evaluationCases } from './data/evaluation-cases';
import {
  intentionallyBadResponses,
  validSimulatedResponses,
} from './data/simulated-responses';
import { evaluateResponse } from './evaluator';

const catalogTitles = courses.map((course) => course.title);

test.describe('Deterministic AI recommendation evaluation', { tag: '@ai-eval' }, () => {
  for (const testCase of evaluationCases) {
    test(`${testCase.name} passes with a valid simulated response`, () => {
      const response = validSimulatedResponses[testCase.id];
      expect(response).toBeDefined();
      const result = evaluateResponse(testCase, response, catalogTitles);

      expect(result).toMatchObject({
        relevant: true,
        grounded: true,
        abstainedCorrectly: true,
        rankingCorrect: true,
        withinRecommendationLimit: true,
        passed: true,
      });
    });
  }

  for (const fixture of intentionallyBadResponses) {
    test(`detects ${fixture.name}`, () => {
      const testCase = evaluationCases.find(
        (candidate) => candidate.id === fixture.caseId,
      );
      if (!testCase) {
        throw new Error(`Evaluation case not found: ${fixture.caseId}`);
      }

      const result = evaluateResponse(testCase, fixture.response, catalogTitles);

      expect(result.passed).toBe(false);
      expect(result[fixture.failedCriterion]).toBe(false);
    });
  }
});
