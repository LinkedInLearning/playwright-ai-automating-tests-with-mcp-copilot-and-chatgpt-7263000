import { test, expect } from '@playwright/test';
import { login, createBug, deleteBugIfExists } from './test-helpers';

test.describe('Delete Bug - from details view', () => {
  let title: string;

  test.beforeEach(async ({ page }) => {
    await login(page);
    title = `delete-bug-${Date.now()}`;
    await createBug(page, title);
  });

  test.afterEach(async ({ page }) => {
    await deleteBugIfExists(page, title);
  });

  test('should_delete_from_details_view', async ({ page }) => {
    // open details (row click)
    const row = page.locator('table[aria-label="Bugs"] tbody tr', { hasText: title }).first();
    await row.click();

    // ensure details show and Delete works
    const dialog = page.getByRole('dialog', { name: /Edit bug/ });
    const deleteButton = dialog.getByRole('button', { name: 'Delete' });
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    const titleLocator = page.locator('table[aria-label="Bugs"] >> text=' + title);
    await expect(titleLocator).toHaveCount(0);
  });
});
