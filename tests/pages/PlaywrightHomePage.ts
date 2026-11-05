import type { Locator, Page } from "@playwright/test";

export class PlaywrightHomePage {
  readonly page: Page;
  readonly getStartedLink: Locator;
  readonly installationHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getStartedLink = page.getByRole("link", { name: "Get started" });
    this.installationHeading = page.getByRole("heading", {
      name: "Installation",
    });
  }

  async goto() {
    await this.page.goto("https://playwright.dev/");
  }

  async openGettingStartedGuide() {
    await this.getStartedLink.click();
  }
}
