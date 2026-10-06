import type { Locator, Page } from '@playwright/test';

export class LearningAssistantPage {
  readonly noMatchMessage: Locator;
  readonly promptInput: Locator;
  readonly recommendedCourses: Locator;
  readonly sendButton: Locator;

  constructor(private readonly page: Page) {
    this.noMatchMessage = page.getByText(
      "I couldn't find a matching course. Try asking about testing, Python, AI, SQL or security.",
      { exact: true },
    );
    this.promptInput = page.getByRole('textbox', { name: 'Ask the learning assistant' });
    this.recommendedCourses = page.getByRole('article');
    this.sendButton = page.getByRole('button', { name: 'Send ↑' });
  }

  async openFromNavigation(): Promise<void> {
    await this.page.getByRole('button', { name: 'Learning assistant', exact: true }).click();
  }

  async submitWithEnter(prompt: string): Promise<void> {
    await this.promptInput.fill(prompt);
    await this.promptInput.press('Enter');
  }

  async submitWithSend(prompt: string): Promise<void> {
    await this.promptInput.fill(prompt);
    await this.sendButton.click();
  }

  recommendedCourse(title: string): Locator {
    return this.recommendedCourses.filter({
      has: this.page.getByRole('heading', { name: title, exact: true }),
    });
  }
}
