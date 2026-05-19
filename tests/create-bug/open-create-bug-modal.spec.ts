import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BoardPage } from '../pages/BoardPage';
import { CreateBugModal } from '../pages/CreateBugModal';

test.describe('Create Bug - Open create-bug modal from board', () => {
  test('should open the create-bug modal from the board page', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const boardPage = new BoardPage(page);
    const createBugModal = new CreateBugModal(page);

    // Act
    await loginPage.loginWithFirstUser();
    await boardPage.clickNewBugButton();

    // Assert
    await expect(createBugModal.dialog).toBeVisible();
    await expect(createBugModal.titleInput).toBeVisible();
    await expect(createBugModal.severitySelect).toBeVisible();
    await expect(createBugModal.ownerInput).toBeVisible();
    await expect(createBugModal.descriptionInput).toBeVisible();
    await expect(createBugModal.saveButton).toBeVisible();
    await expect(createBugModal.cancelButton).toBeVisible();
  });
});
