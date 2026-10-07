import { expect, test } from '@playwright/test';
import { LearningAssistantPage } from './pages/learning-assistant-page';
import { assistantPrompts, courseTitles } from './data/learnspace-test-data';

test.describe('Reject unrelated natural-language prompts rather than returning false matches', { tag: '@ui' }, () => {
  test('[P2] Reject unrelated natural-language prompts rather than returning false matches', async ({ page }) => {
    const assistant = new LearningAssistantPage(page);

    // 1. Submit an unrelated goal and verify the assistant abstains.
    await page.goto('/');
    await assistant.openFromNavigation();
    await assistant.submitWithEnter('I want to learn pottery');

    await expect(assistant.recommendedCourses).toHaveCount(0);
    await expect(assistant.noMatchMessage).toBeVisible();

    // 2. Submit an unambiguous supported goal.
    await assistant.submitWithEnter(assistantPrompts.python);

    await expect(assistant.recommendedCourse(courseTitles.pythonForDataAnalysis)).toBeVisible();
  });
});
