import { expect, test } from '@playwright/test';
import { LearningAssistantPage } from './pages/learning-assistant-page';

test.describe('Reject unrelated natural-language prompts rather than returning false matches', () => {
  test('[P2] Reject unrelated natural-language prompts rather than returning false matches', async ({ page }) => {
    const assistant = new LearningAssistantPage(page);

    // 1. Submit an unrelated goal and verify the assistant abstains.
    await page.goto('/');
    await assistant.openFromNavigation();
    await assistant.submitWithEnter('I want to learn pottery');

    await expect(assistant.recommendedCourses).toHaveCount(0);
    await expect(assistant.noMatchMessage).toBeVisible();

    // 2. Submit an unambiguous supported goal.
    await assistant.submitWithEnter('Python');

    await expect(assistant.recommendedCourse('Python for Data Analysis')).toBeVisible();
  });
});
