import { test, expect } from '@playwright/test';
import { login, createBug, deleteBugIfExists } from './test-helpers';

test.describe('Delete Bug - cancel retains bug', () => {
  let title: string;

  test.beforeEach(async ({ page }) => {
    await login(page);
    title = `delete-bug-${Date.now()}`;
    await createBug(page, title);
  });

  test.afterEach(async ({ page }) => {
    await deleteBugIfExists(page, title);
  });

  test('should_not_delete_when_cancelled', async ({ page }) => {
    const row = page.locator('table[aria-label="Bugs"] tbody tr', { hasText: title }).first();
    await row.click();

    const dialog = page.getByRole('dialog', { name: /Edit bug/ });
    const cancelButton = dialog.getByRole('button', { name: 'Cancel' });
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();

    const titleLocator = page.locator('table[aria-label="Bugs"] >> text=' + title);
    await expect(titleLocator).toHaveCount(1);
  });
});
