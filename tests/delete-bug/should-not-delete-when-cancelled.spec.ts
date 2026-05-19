import { test, expect } from '../fixtures/pages';
import { createBug, deleteBugIfExists } from './test-helpers';

test.describe('Delete Bug - cancel retains bug', () => {
  let title: string;

  test.beforeEach(async ({ page, loginPage, boardPage, createBugModal }) => {
    await loginPage.loginWithFirstUser();
    title = `delete-bug-${Date.now()}`;
    await createBug(page, title, boardPage, createBugModal);
  });

  test.afterEach(async ({ page, boardPage, editBugModal }) => {
    await deleteBugIfExists(page, title, boardPage, editBugModal);
  });

  test('should_not_delete_when_cancelled', async ({ page, boardPage, editBugModal }) => {
    // Act
    await boardPage.clickBugByTitle(title);
    await expect(editBugModal.dialog).toBeVisible();
    await editBugModal.openDeleteConfirmation();
    await editBugModal.cancelDeleteConfirmation();

    // Assert
    await expect(editBugModal.dialog).toBeVisible();
    const titleLocator = page.locator('table[aria-label="Bugs"] >> text=' + title);
    await expect(titleLocator).toHaveCount(1);

    // Cleanup state for afterEach
    await editBugModal.cancel();
  });
});
