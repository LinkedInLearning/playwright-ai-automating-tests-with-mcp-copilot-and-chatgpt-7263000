import { test, expect } from '../fixtures/pages';
import { login, createBug, deleteBugIfExists } from './test-helpers';

test.describe('Delete Bug - create then delete', () => {
  let title: string;

  test.beforeEach(async ({ page, boardPage, createBugModal }) => {
    await login(page);
    title = `delete-bug-${Date.now()}`;
    await createBug(page, title, boardPage, createBugModal);
  });

  test.afterEach(async ({ page, boardPage, editBugModal }) => {
    await deleteBugIfExists(page, title, boardPage, editBugModal);
  });

  test('should_create_then_delete_bug', async ({ page, boardPage, editBugModal }) => {
    // Act
    await boardPage.clickBugByTitle(title);
    await expect(editBugModal.dialog).toBeVisible();
    await editBugModal.delete();

    // Assert
    const titleLocator = page.locator('table[aria-label="Bugs"] >> text=' + title);
    await expect(titleLocator).toHaveCount(0);
  });
});
