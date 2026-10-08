import { courseTitles } from '../../data/learnspace-test-data';
import type { EvaluationCriterion } from '../evaluator';

export type SimulatedResponse = {
  recommendations: string[];
};

export const validSimulatedResponses: Record<string, SimulatedResponse> = {
  python: { recommendations: [courseTitles.pythonForDataAnalysis] },
  sql: { recommendations: [courseTitles.sqlFundamentals] },
  playwright: {
    recommendations: [
      courseTitles.advancedPlaywright,
      courseTitles.apiTestingFundamentals,
      courseTitles.typeScriptFundamentals,
    ],
  },
  'api-testing': {
    recommendations: [courseTitles.apiTestingFundamentals],
  },
  pottery: { recommendations: [] },
  ai: { recommendations: [courseTitles.aiForSoftwareEngineers] },
  cybersecurity: {
    recommendations: [courseTitles.introductionToCybersecurity],
  },
  'recommendation-limit': {
    recommendations: [
      courseTitles.pythonForDataAnalysis,
      courseTitles.typeScriptFundamentals,
      courseTitles.advancedPlaywright,
    ],
  },
};

export const intentionallyBadResponses = [
  {
    name: 'unrelated but catalog-backed recommendation',
    caseId: 'python',
    failedCriterion: 'relevant',
    response: { recommendations: [courseTitles.leadershipEssentials] },
  },
  {
    name: 'invented course',
    caseId: 'python',
    failedCriterion: 'grounded',
    response: { recommendations: ['Course That Does Not Exist'] },
  },
  {
    name: 'failure to abstain',
    caseId: 'pottery',
    failedCriterion: 'abstainedCorrectly',
    response: { recommendations: [courseTitles.pythonForDataAnalysis] },
  },
  {
    name: 'incorrect ranking',
    caseId: 'playwright',
    failedCriterion: 'rankingCorrect',
    response: {
      recommendations: [
        courseTitles.apiTestingFundamentals,
        courseTitles.advancedPlaywright,
        courseTitles.typeScriptFundamentals,
      ],
    },
  },
  {
  name: 'too many recommendations',
  caseId: 'recommendation-limit',
  failedCriterion: 'withinRecommendationLimit',
  response: {
    recommendations: [
      courseTitles.pythonForDataAnalysis,
      courseTitles.advancedPlaywright,
      courseTitles.apiTestingFundamentals,
      courseTitles.typeScriptFundamentals,
      ],
    },
  },
] satisfies Array<{
  name: string;
  caseId: string;
  failedCriterion: EvaluationCriterion;
  response: SimulatedResponse;
}>;