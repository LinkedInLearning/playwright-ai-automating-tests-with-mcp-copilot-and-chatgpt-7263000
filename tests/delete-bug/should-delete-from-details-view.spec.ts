import { test, expect } from '@playwright/test';
import { BoardPage } from '../pages/BoardPage';
import { EditBugModal } from '../pages/EditBugModal';
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
    // Arrange
    const boardPage = new BoardPage(page);
    const editBugModal = new EditBugModal(page);

    // Act - open details (row click)
    await boardPage.clickBugByTitle(title);
    await expect(editBugModal.dialog).toBeVisible();
    await editBugModal.delete();

    // Assert
    const titleLocator = page.locator('table[aria-label="Bugs"] >> text=' + title);
    await expect(titleLocator).toHaveCount(0);
  });
});
