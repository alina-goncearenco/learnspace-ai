import { expect, test } from '@playwright/test';
import { LearningAssistantPage } from './pages/learning-assistant-page';
import { courseTitles } from './data/learnspace-test-data';

test.describe('Learning Assistant recommendation specificity', () => {
  test('[P1] Return only the appropriate course for a supported SQL goal', async ({ page }) => {
    const assistant = new LearningAssistantPage(page);

    // 1. Open the app and Learning Assistant, then submit the SQL learning goal.
    await page.goto('/');
    await assistant.openFromNavigation();
    await assistant.submitWithEnter('I want to learn SQL');

    // 2. Verify exactly one recommendation is returned.
    await expect(assistant.recommendedCourses).toHaveCount(1);

    // 3. Verify the recommendation is SQL Fundamentals.
    await expect(assistant.recommendedCourse(courseTitles.sqlFundamentals)).toBeVisible();
  });
});
