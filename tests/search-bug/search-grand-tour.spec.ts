import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BoardPage } from '../pages/BoardPage';

const bugData = [
  { title: 'Login page crashes on empty password', severity: 'HIGH', owner: 'buggy', description: 'App crashes when submitting an empty password on login.' },
  { title: 'Login page redirect fails after auth', severity: 'MID', owner: 'buggy', description: 'User is not redirected to board after successful login.' },
  { title: 'Login page error message not shown', severity: 'LOW', owner: 'buggy', description: 'No error message appears for invalid credentials.' },
  { title: 'Login page enter key stops working', severity: 'MID', owner: 'buggy', description: 'Enter key does not submit the login form.' },
  { title: 'Board page fails to load', severity: 'HIGH', owner: 'buggy', description: 'The bug board is empty even when bugs exist in the database.' },
  { title: 'Search field disappears on page resize', severity: 'LOW', owner: 'buggy', description: 'The search input is not visible after resizing the window.' },
  { title: 'Severity dropdown missing on create page', severity: 'MID', owner: 'buggy', description: 'The severity dropdown does not render in the create bug modal.' },
  { title: 'Create page modal does not close on cancel', severity: 'LOW', owner: 'buggy', description: 'The create bug modal stays open after clicking Cancel.' },
  { title: 'Title bar logo missing on page load', severity: 'LOW', owner: 'buggy', description: 'The logo image does not appear in the title bar.' },
  { title: 'Sort resets on page refresh', severity: 'MID', owner: 'buggy', description: 'Sorting order is lost when the page is refreshed.' },
];

test.describe('Search Bug', () => {
  let createdBugIds: number[] = [];

  test.beforeEach(async ({ page, request }) => {
    // Arrange - Login via UI
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('buggy', '1970beetle');

    // Create 10 bugs via API
    createdBugIds = [];
    for (const bug of bugData) {
      const response = await request.post('/api/bugs', { data: bug });
      const body = await response.json();
      createdBugIds.push(body.id);
    }

    // Reload so the board reflects the newly created bugs
    await page.reload();
  });

  test.afterEach(async ({ request }) => {
    for (const id of createdBugIds) {
      await request.delete(`/api/bugs/${id}`);
    }
    createdBugIds = [];
  });

  test('Search bugs by title on the board page', async ({ page }) => {
    // Arrange
    const boardPage = new BoardPage(page);

    // Act & Assert - Search "page" → all 10 bugs visible
    await boardPage.searchByTitle('page');

    await expect(await boardPage.getBugCellByTitle('Login page crashes on empty password')).toBeVisible();
    await expect(await boardPage.getBugCellByTitle('Login page redirect fails after auth')).toBeVisible();
    await expect(await boardPage.getBugCellByTitle('Login page error message not shown')).toBeVisible();
    await expect(await boardPage.getBugCellByTitle('Login page enter key stops working')).toBeVisible();
    await expect(await boardPage.getBugCellByTitle('Board page fails to load')).toBeVisible();
    await expect(await boardPage.getBugCellByTitle('Search field disappears on page resize')).toBeVisible();
    await expect(await boardPage.getBugCellByTitle('Severity dropdown missing on create page')).toBeVisible();
    await expect(await boardPage.getBugCellByTitle('Create page modal does not close on cancel')).toBeVisible();
    await expect(await boardPage.getBugCellByTitle('Title bar logo missing on page load')).toBeVisible();
    await expect(await boardPage.getBugCellByTitle('Sort resets on page refresh')).toBeVisible();

    // Clear → search "login" → 4 login bugs visible, 6 non-login bugs not visible
    await boardPage.clearSearch();
    await boardPage.searchByTitle('login');

    await expect(await boardPage.getBugCellByTitle('Login page crashes on empty password')).toBeVisible();
    await expect(await boardPage.getBugCellByTitle('Login page redirect fails after auth')).toBeVisible();
    await expect(await boardPage.getBugCellByTitle('Login page error message not shown')).toBeVisible();
    await expect(await boardPage.getBugCellByTitle('Login page enter key stops working')).toBeVisible();

    await expect(await boardPage.getBugCellByTitle('Board page fails to load')).not.toBeVisible();
    await expect(await boardPage.getBugCellByTitle('Search field disappears on page resize')).not.toBeVisible();
    await expect(await boardPage.getBugCellByTitle('Severity dropdown missing on create page')).not.toBeVisible();
    await expect(await boardPage.getBugCellByTitle('Create page modal does not close on cancel')).not.toBeVisible();
    await expect(await boardPage.getBugCellByTitle('Title bar logo missing on page load')).not.toBeVisible();
    await expect(await boardPage.getBugCellByTitle('Sort resets on page refresh')).not.toBeVisible();

    // Clear → search "xyzzy" → no-results message shown, no bug titles visible
    await boardPage.clearSearch();
    await boardPage.searchByTitle('xyzzy');

    await expect(await boardPage.getNoResultsMessage()).toBeVisible();

    await expect(await boardPage.getBugCellByTitle('Login page crashes on empty password')).not.toBeVisible();
    await expect(await boardPage.getBugCellByTitle('Login page redirect fails after auth')).not.toBeVisible();
    await expect(await boardPage.getBugCellByTitle('Login page error message not shown')).not.toBeVisible();
    await expect(await boardPage.getBugCellByTitle('Login page enter key stops working')).not.toBeVisible();
    await expect(await boardPage.getBugCellByTitle('Board page fails to load')).not.toBeVisible();
    await expect(await boardPage.getBugCellByTitle('Search field disappears on page resize')).not.toBeVisible();
    await expect(await boardPage.getBugCellByTitle('Severity dropdown missing on create page')).not.toBeVisible();
    await expect(await boardPage.getBugCellByTitle('Create page modal does not close on cancel')).not.toBeVisible();
    await expect(await boardPage.getBugCellByTitle('Title bar logo missing on page load')).not.toBeVisible();
    await expect(await boardPage.getBugCellByTitle('Sort resets on page refresh')).not.toBeVisible();
  });
});