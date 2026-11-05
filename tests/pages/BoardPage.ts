import type { Locator, Page } from "@playwright/test";

export type BugStateFilter = "Open" | "Closed";

export class BoardPage {
  readonly page: Page;
  readonly newBugButton: Locator;
  readonly searchInput: Locator;
  readonly clearSearchButton: Locator;
  readonly noResultsMessage: Locator;
  readonly openFilterButton: Locator;
  readonly closedFilterButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newBugButton = page.getByRole("button", { name: "New Bug" });
    this.searchInput = page.getByRole("search", {
      name: "Search bugs by title",
    });
    this.clearSearchButton = page.getByRole("button", { name: "Clear search" });
    this.noResultsMessage = page.getByRole("cell", {
      name: "No bugs matched.",
      exact: true,
    });
    this.openFilterButton = page.getByRole("button", {
      name: "Open",
      exact: true,
    });
    this.closedFilterButton = page.getByRole("button", {
      name: "Closed",
      exact: true,
    });
  }

  async goto() {
    await this.page.goto("/board");
  }

  async openCreateBugModal() {
    await this.newBugButton.click();
  }

  async searchBugsByTitle(query: string) {
    await this.searchInput.fill(query);
  }

  async clearTitleSearch() {
    await this.clearSearchButton.click();
  }

  async filterByState(state: BugStateFilter) {
    if (state === "Open") {
      await this.openFilterButton.click();
    } else {
      await this.closedFilterButton.click();
    }
  }

  getBugTitleCell(title: string): Locator {
    return this.page.getByRole("cell", { name: title, exact: true });
  }

  getBugRow(title: string): Locator {
    return this.page
      .getByRole("button")
      .filter({ has: this.getBugTitleCell(title) });
  }

  async openBug(title: string) {
    await this.getBugRow(title).click();
  }

  async reload() {
    await this.page.reload();
  }
}
