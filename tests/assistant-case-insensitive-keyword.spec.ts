import { expect, test } from '@playwright/test';
import { LearningAssistantPage } from './pages/learning-assistant-page';
import { courseTitles } from './data/learnspace-test-data';

test.describe('Learning Assistant input robustness', () => {
  test('[P2] Case-insensitive supported keyword', async ({ page }) => {
    const assistant = new LearningAssistantPage(page);

    // 1. Navigate to the app and open the Learning Assistant once.
    await page.goto('/');
    await assistant.openFromNavigation();

    // 2. Submit each casing variation and verify the recommendation.
    for (const prompt of ['python', 'Python', 'PYTHON']) {
      await assistant.submitWithEnter(prompt);
      await expect(assistant.recommendedCourse(courseTitles.pythonForDataAnalysis)).toBeVisible();
    }
  });
});
