export const courseTitles = {
  pythonForDataAnalysis: 'Python for Data Analysis',
  sqlFundamentals: 'SQL Fundamentals',
  advancedPlaywright: 'Advanced Playwright',
  apiTestingFundamentals: 'API Testing Fundamentals',
  typeScriptFundamentals: 'TypeScript Fundamentals',
} as const;

export const browserAutomationRecommendationTitles = [
  courseTitles.advancedPlaywright,
  courseTitles.apiTestingFundamentals,
  courseTitles.typeScriptFundamentals,
] as const;

export const assistantPrompts = {
  python: 'Python',
} as const;