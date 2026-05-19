import { test, expect } from '@playwright/test';

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
    // Login via UI
    await page.goto('/login');
    await page.getByLabel('Username').fill('buggy');
    await page.getByLabel('Password').fill('1970beetle');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/\/board$/);

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
    const searchInput = page.getByRole('search', { name: 'Search bugs by title' });

    // Search "page" → all 10 bugs visible
    await searchInput.fill('page');

    await expect(page.getByRole('cell', { name: 'Login page crashes on empty password', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Login page redirect fails after auth', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Login page error message not shown', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Login page enter key stops working', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Board page fails to load', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Search field disappears on page resize', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Severity dropdown missing on create page', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Create page modal does not close on cancel', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Title bar logo missing on page load', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Sort resets on page refresh', exact: true })).toBeVisible();

    // Clear → search "login" → 4 login bugs visible, 6 non-login bugs not visible
    await page.getByRole('button', { name: 'Clear search' }).click();
    await searchInput.fill('login');

    await expect(page.getByRole('cell', { name: 'Login page crashes on empty password', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Login page redirect fails after auth', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Login page error message not shown', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Login page enter key stops working', exact: true })).toBeVisible();

    await expect(page.getByRole('cell', { name: 'Board page fails to load', exact: true })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'Search field disappears on page resize', exact: true })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'Severity dropdown missing on create page', exact: true })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'Create page modal does not close on cancel', exact: true })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'Title bar logo missing on page load', exact: true })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'Sort resets on page refresh', exact: true })).not.toBeVisible();

    // Clear → search "xyzzy" → no-results message shown, no bug titles visible
    await page.getByRole('button', { name: 'Clear search' }).click();
    await searchInput.fill('xyzzy');

    await expect(page.getByRole('cell', { name: 'No bugs matched.', exact: true })).toBeVisible();

    await expect(page.getByRole('cell', { name: 'Login page crashes on empty password', exact: true })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'Login page redirect fails after auth', exact: true })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'Login page error message not shown', exact: true })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'Login page enter key stops working', exact: true })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'Board page fails to load', exact: true })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'Search field disappears on page resize', exact: true })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'Severity dropdown missing on create page', exact: true })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'Create page modal does not close on cancel', exact: true })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'Title bar logo missing on page load', exact: true })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'Sort resets on page refresh', exact: true })).not.toBeVisible();
  });
});