import { test, expect } from '@playwright/test';
import { BoardPage } from '../pages/BoardPage';
import { EditBugModal } from '../pages/EditBugModal';
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
    // Arrange
    const boardPage = new BoardPage(page);
    const editBugModal = new EditBugModal(page);

    // Act
    await boardPage.clickBugByTitle(title);
    await expect(editBugModal.dialog).toBeVisible();
    await editBugModal.cancel();

    // Assert
    const titleLocator = page.locator('table[aria-label="Bugs"] >> text=' + title);
    await expect(titleLocator).toHaveCount(1);
  });
});
