import type { Locator, Page } from '@playwright/test';

export class CourseCatalogPage {
  readonly courseCards: Locator;
  readonly courseCount: Locator;
  readonly searchInput: Locator;

  constructor(private readonly page: Page) {
    this.courseCards = page.getByRole('article');
    this.courseCount = page.getByText(/^\d+ courses$/);
    this.searchInput = page.getByRole('textbox', { name: 'Search courses' });
  }

  async searchFor(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.fill('');
  }

  async selectCategory(category: string): Promise<void> {
    await this.page.getByRole('button', { name: category, exact: true }).click();
  }

  courseCard(title: string): Locator {
    return this.courseCards.filter({
      has: this.page.getByRole('heading', { name: title, exact: true }),
    });
  }
}
