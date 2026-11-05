import type { Locator, Page } from "@playwright/test";

export class EditBugModal {
  readonly page: Page;
  readonly dialog: Locator;
  readonly renderedDialog: Locator;
  readonly heading: Locator;
  readonly stateSelect: Locator;
  readonly deleteButton: Locator;
  readonly deleteConfirmationDialog: Locator;
  readonly confirmDeleteButton: Locator;
  readonly cancelDeleteButton: Locator;
  readonly closeDeleteConfirmationButton: Locator;
  readonly cancelButton: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.getByRole("dialog");
    this.renderedDialog = page.locator('[role="dialog"]');
    this.heading = this.dialog.getByRole("heading", { name: /^Edit bug #/ });
    this.stateSelect = this.dialog.getByLabel("State");
    this.deleteButton = this.dialog.getByRole("button", {
      name: "Delete",
      exact: true,
    });
    this.deleteConfirmationDialog = page.getByRole("alertdialog", {
      name: "Delete bug?",
    });
    this.confirmDeleteButton = this.deleteConfirmationDialog.getByRole("button", {
      name: "Delete bug",
      exact: true,
    });
    this.cancelDeleteButton = this.deleteConfirmationDialog.getByRole("button", {
      name: "Cancel",
      exact: true,
    });
    this.closeDeleteConfirmationButton =
      this.deleteConfirmationDialog.getByRole("button", {
        name: "Close delete confirmation",
      });
    this.cancelButton = this.dialog.getByRole("button", {
      name: "Cancel",
      exact: true,
    });
    this.saveButton = this.dialog.getByRole("button", {
      name: "Save",
      exact: true,
    });
  }

  async setState(state: "Open" | "Closed") {
    await this.stateSelect.selectOption({ label: state });
  }

  async save() {
    await this.saveButton.click();
  }

  async deleteBug() {
    await this.openDeleteConfirmation();
    await this.confirmDelete();
  }

  async openDeleteConfirmation() {
    await this.deleteButton.click();
  }

  async confirmDelete() {
    await this.confirmDeleteButton.click();
  }

  async cancelDeleteConfirmation() {
    await this.cancelDeleteButton.click();
  }

  async closeDeleteConfirmation() {
    await this.closeDeleteConfirmationButton.click();
  }

  async dismissDeleteConfirmationWithEscape() {
    await this.page.keyboard.press("Escape");
  }

  async cancel() {
    await this.cancelButton.click();
  }
}
