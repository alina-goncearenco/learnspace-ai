import { expect, test } from '@playwright/test';
import { CourseCatalogPage } from './pages/course-catalog-page';
import { courseTitles } from './data/learnspace-test-data';

test.describe('Browse the catalog and filter by category', { tag: '@ui' }, () => {
  test('[P0] Browse the catalog and filter by category', async ({ page }) => {
    const catalog = new CourseCatalogPage(page);

    // 1. Open the app and inspect the course catalog.
    await page.goto('/');

    await expect(catalog.courseCount).toHaveText('8 courses');
    await expect(catalog.courseCards).toHaveCount(8);

    const typeScriptCourse = catalog.courseCard(courseTitles.typeScriptFundamentals);
    await expect(typeScriptCourse.getByText('Programming', { exact: true })).toBeVisible();
    await expect(typeScriptCourse.getByText('Beginner', { exact: true })).toBeVisible();
    await expect(typeScriptCourse.getByText('Learn types, interfaces, functions and practical TypeScript.')).toBeVisible();
    await expect(typeScriptCourse.getByRole('button', { name: 'Get a recommendation →' })).toBeVisible();

    // 2. Select the Programming category.
    await catalog.selectCategory('Programming');

    await expect(catalog.courseCount).toHaveText('2 courses');
    await expect(catalog.courseCards).toHaveCount(2);
    await expect(catalog.courseCard(courseTitles.typeScriptFundamentals)).toBeVisible();
    await expect(catalog.courseCard(courseTitles.pythonForDataAnalysis)).toBeVisible();

    // 3. Select All and confirm the full catalog returns.
    await catalog.selectCategory('All');

    await expect(catalog.courseCount).toHaveText('8 courses');
    await expect(catalog.courseCards).toHaveCount(8);
  });
});
