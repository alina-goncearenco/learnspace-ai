export const courseTitles = {
  pythonForDataAnalysis: 'Python for Data Analysis',
  sqlFundamentals: 'SQL Fundamentals',
  advancedPlaywright: 'Advanced Playwright',
  apiTestingFundamentals: 'API Testing Fundamentals',
  typeScriptFundamentals: 'TypeScript Fundamentals',
  introductionToCybersecurity: 'Introduction to Cybersecurity',
  aiForSoftwareEngineers: 'AI for Software Engineers',
  leadershipEssentials: 'Leadership Essentials',
} as const;

export const canonicalCourseTitles = Object.values(courseTitles);

export const browserAutomationRecommendationTitles = [
  courseTitles.advancedPlaywright,
  courseTitles.apiTestingFundamentals,
  courseTitles.typeScriptFundamentals,
] as const;

export const assistantPrompts = {
  python: 'Python',
} as const;

export const recommendationApiPrompts = {
  python: 'I want to learn Python',
  unsupported: 'I want to learn pottery',
} as const;

export const invalidRecommendationRequests = [
  { name: 'missing prompt', payload: {} },
  { name: 'empty prompt', payload: { prompt: '' } },
  { name: 'non-string prompt', payload: { prompt: 42 } },
] as const;