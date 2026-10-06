import { expect, test } from '@playwright/test';
import { LearningAssistantPage } from './pages/learning-assistant-page';
import { browserAutomationRecommendationTitles } from './data/learnspace-test-data';

test.describe('Get recommendations for a supported learning goal', () => {
  test('[P0] Get recommendations for a supported learning goal', async ({ page }) => {
    const assistant = new LearningAssistantPage(page);

    // 1. Open the assistant and submit the goal with Enter.
    await page.goto('/');
    await assistant.openFromNavigation();
    await assistant.submitWithEnter('I want to learn browser automation');

    for (const courseTitle of browserAutomationRecommendationTitles) {
      await expect(assistant.recommendedCourse(courseTitle)).toBeVisible();
    }

    // 2. Submit the goal with Send in the same assistant session.
    await assistant.submitWithSend('I want to learn browser automation');

    for (const courseTitle of browserAutomationRecommendationTitles) {
      await expect(assistant.recommendedCourse(courseTitle)).toBeVisible();
    }
  });
});
