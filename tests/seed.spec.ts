import { test, expect } from './fixtures/pages';

test.describe('Seed tests', () => {
  test('login with first user from users.json', { tag: '@seed' }, async ({ loginPage, page }) => {
    // Act
    await loginPage.loginWithFirstUser();

    // Assert
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  });
});
