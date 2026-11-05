import type { Locator, Page } from "@playwright/test";

export interface BugFormData {
  title: string;
  severity: string;
  owner: string;
  description: string;
}

export class CreateBugModal {
  readonly dialog: Locator;
  readonly heading: Locator;
  readonly titleInput: Locator;
  readonly severitySelect: Locator;
  readonly ownerInput: Locator;
  readonly descriptionInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.dialog = page.getByRole("dialog");
    this.heading = this.dialog.getByRole("heading", { name: "Create bug" });
    this.titleInput = this.dialog.getByRole("textbox", { name: "Title" });
    this.severitySelect = this.dialog.getByRole("combobox", {
      name: "Severity",
    });
    this.ownerInput = this.dialog.getByRole("textbox", { name: "Owner" });
    this.descriptionInput = this.dialog.getByRole("textbox", {
      name: "Description",
    });
    this.saveButton = this.dialog.getByRole("button", { name: "Save" });
    this.cancelButton = this.dialog.getByRole("button", { name: "Cancel" });
    this.closeButton = this.dialog.getByRole("button", { name: "Close" });
  }

  async fillBugForm(data: BugFormData) {
    await this.titleInput.fill(data.title);
    await this.severitySelect.selectOption({ label: data.severity });
    await this.ownerInput.fill(data.owner);
    await this.descriptionInput.fill(data.description);
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }
}
