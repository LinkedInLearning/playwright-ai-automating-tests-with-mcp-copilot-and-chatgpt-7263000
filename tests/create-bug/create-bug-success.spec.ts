import { test, expect } from '../fixtures/pages';

test('user can log in and create a new bug', async ({
  page,
  loginPage,
  boardPage,
  createBugModal,
}) => {
  // Arrange
  await loginPage.goto();

  // Act - Login
  await loginPage.login('buggy', '1970beetle');
  await expect(page).toHaveURL('/board');

  // Act - Create bug
  await boardPage.clickNewBugButton();
  await createBugModal.fillBugForm({
    title: 'Login button not responding',
    severity: 'HIGH',
    owner: 'buggy',
    description:
      'Users cannot click the login button on mobile devices. The button appears unresponsive.',
  });
  await createBugModal.submit();

  // Assert
  await expect(page).toHaveURL('/board');
  await expect(page.getByText('Login button not responding')).toBeVisible();
});
