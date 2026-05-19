import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Seed tests', () => {
  test('login with first user from users.json', { tag: '@seed' }, async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);

    // Act
    await loginPage.loginWithFirstUser();

    // Assert
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  });
});
