import { courseTitles } from '../../data/learnspace-test-data';

export type EvaluationCase = {
  id: string;
  name: string;
  prompt: string;
  relevantCourses: string[];
  expectedTopCourse?: string;
  shouldAbstain: boolean;
};

export const evaluationCases = [
  {
    id: 'python',
    name: 'Python learning goal',
    prompt: 'I want to learn Python for data analysis',
    relevantCourses: [courseTitles.pythonForDataAnalysis],
    expectedTopCourse: courseTitles.pythonForDataAnalysis,
    shouldAbstain: false,
  },
  {
    id: 'sql',
    name: 'SQL learning goal',
    prompt: 'I want to learn SQL and databases',
    relevantCourses: [courseTitles.sqlFundamentals],
    expectedTopCourse: courseTitles.sqlFundamentals,
    shouldAbstain: false,
  },
  {
    id: 'playwright',
    name: 'Browser automation with Playwright',
    prompt: 'I want to learn browser automation with Playwright',
    relevantCourses: [
      courseTitles.advancedPlaywright,
      courseTitles.apiTestingFundamentals,
      courseTitles.typeScriptFundamentals,
    ],
    expectedTopCourse: courseTitles.advancedPlaywright,
    shouldAbstain: false,
  },
  {
    id: 'api-testing',
    name: 'API testing learning goal',
    prompt: 'I want to learn how to test APIs',
    relevantCourses: [courseTitles.apiTestingFundamentals],
    expectedTopCourse: courseTitles.apiTestingFundamentals,
    shouldAbstain: false,
  },
  {
    id: 'recommendation-limit',
    name: 'Recommendation limit',

    prompt: 'I want to learn programming and testing',

    relevantCourses: [
      courseTitles.pythonForDataAnalysis,
      courseTitles.typeScriptFundamentals,
      courseTitles.advancedPlaywright,
      courseTitles.apiTestingFundamentals,
    ],

    expectedTopCourse: courseTitles.pythonForDataAnalysis,
    shouldAbstain: false,
  },
  {
    id: 'pottery',
    name: 'Unsupported topic',
    prompt: 'I want to learn pottery',
    relevantCourses: [],
    shouldAbstain: true,
  },
  {
    id: 'ai',
    name: 'AI learning goal',
    prompt: 'I want to learn about AI and language models',
    relevantCourses: [courseTitles.aiForSoftwareEngineers],
    expectedTopCourse: courseTitles.aiForSoftwareEngineers,
    shouldAbstain: false,
  },
  {
    id: 'cybersecurity',
    name: 'Security learning goal',
    prompt: 'I want to learn cybersecurity',
    relevantCourses: [courseTitles.introductionToCybersecurity],
    expectedTopCourse: courseTitles.introductionToCybersecurity,
    shouldAbstain: false,
  }
] satisfies EvaluationCase[];