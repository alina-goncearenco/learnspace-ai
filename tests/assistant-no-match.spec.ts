import { expect, test } from '@playwright/test';
import { LearningAssistantPage } from './pages/learning-assistant-page';

test.describe('Handle an assistant prompt with no matching catalog terms', () => {
  test('[P1] Handle an assistant prompt with no matching catalog terms', async ({ page }) => {
    const assistant = new LearningAssistantPage(page);

    // 1. Submit an unmatched prompt and verify the fallback.
    await page.goto('/');
    await assistant.openFromNavigation();
    await assistant.submitWithEnter('qzxw plmokn flibbertigibbet');

    await expect(assistant.noMatchMessage).toBeVisible();
    await expect(assistant.recommendedCourses).toHaveCount(0);

    // 2. Submit a supported goal after the fallback.
    await assistant.submitWithEnter('SQL');

    await expect(assistant.recommendedCourse('SQL Fundamentals')).toBeVisible();
  });
});
