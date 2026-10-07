import { expect, test } from '@playwright/test';
import { CourseCatalogPage } from './pages/course-catalog-page';
import { courseTitles } from './data/learnspace-test-data';

test.describe('Search for a course and recover to the full catalog', { tag: '@ui' }, () => {
  test('[P0] Search for a course and recover to the full catalog', async ({ page }) => {
    const catalog = new CourseCatalogPage(page);

    // 1. Search for a course by a lowercase keyword.
    await page.goto('/');
    await catalog.searchFor('python');

    await expect(catalog.courseCount).toHaveText('1 courses');
    await expect(catalog.courseCard(courseTitles.pythonForDataAnalysis)).toBeVisible();

    // 2. Replace the query with uppercase text.
    await catalog.searchFor('PYTHON');

    await expect(catalog.courseCount).toHaveText('1 courses');
    await expect(catalog.courseCard(courseTitles.pythonForDataAnalysis)).toBeVisible();

    // 3. Clear the query and recover the full catalog.
    await catalog.clearSearch();

    await expect(catalog.courseCount).toHaveText('8 courses');
    await expect(catalog.courseCards).toHaveCount(8);
  });
});
