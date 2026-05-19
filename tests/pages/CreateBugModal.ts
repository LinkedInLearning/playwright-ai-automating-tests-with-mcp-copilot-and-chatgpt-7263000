import { Page, Locator } from '@playwright/test';

export interface BugFormData {
  title: string;
  severity?: string;
  owner?: string;
  description?: string;
}

export class CreateBugModal {
  readonly page: Page;
  readonly dialog: Locator;
  readonly titleInput: Locator;
  readonly severitySelect: Locator;
  readonly ownerInput: Locator;
  readonly descriptionInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.getByRole('dialog', { name: 'Create bug' });
    this.titleInput = this.dialog.getByLabel('Title');
    this.severitySelect = this.dialog.getByLabel('Severity');
    this.ownerInput = this.dialog.getByLabel('Owner');
    this.descriptionInput = this.dialog.getByLabel('Description');
    this.saveButton = this.dialog.getByRole('button', { name: 'Save' });
    this.cancelButton = this.dialog.getByRole('button', { name: 'Cancel' });
  }

  async fillBugForm(data: BugFormData) {
    await this.titleInput.fill(data.title);
    if (data.severity) {
      await this.severitySelect.selectOption(data.severity);
    }
    if (data.owner) {
      await this.ownerInput.fill(data.owner);
    }
    if (data.description) {
      await this.descriptionInput.fill(data.description);
    }
  }

  async submit() {
    await this.saveButton.click();
    // Wait for modal to close
    await this.page.waitForSelector('[role="dialog"]', { state: 'hidden' });
  }

  async cancel() {
    await this.cancelButton.click();
    // Wait for modal to close
    await this.page.waitForSelector('[role="dialog"]', { state: 'hidden' });
  }

  async isVisible(): Promise<boolean> {
    return await this.dialog.isVisible().catch(() => false);
  }
}
