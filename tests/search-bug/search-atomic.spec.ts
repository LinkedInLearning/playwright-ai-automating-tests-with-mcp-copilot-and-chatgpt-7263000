import { test, expect } from '../fixtures/pages';
import { LoginPage } from '../pages/LoginPage';

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
  let workerBugData: typeof bugData;

  test.beforeEach(async ({ page, request, loginPage, boardPage }, testInfo) => {
    // Create worker-scoped bug data to avoid collisions in parallel execution
    const workerIndex = testInfo.workerIndex;
    workerBugData = bugData.map(bug => ({
      ...bug,
      title: `${bug.title} [W${workerIndex}]`
    }));

    // Arrange - Login via UI
    await loginPage.goto();
    await loginPage.login('buggy', '1970beetle');

    // Create 10 bugs via API with worker-scoped titles
    createdBugIds = [];
    for (const bug of workerBugData) {
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

  test('Search bugs by title matching multiple results', async ({ boardPage }) => {
    // Act
    await boardPage.searchByTitle('page');

    // Assert - verify all bugs matching 'page' are visible
    const pageBugs = workerBugData.filter(bug => bug.title.toLowerCase().includes('page'));
    for (const bug of pageBugs) {
      await expect(await boardPage.getBugCellByTitle(bug.title)).toBeVisible();
    }
  });

  test('Search bugs by title matching subset of results', async ({ boardPage }) => {
    // Act
    await boardPage.searchByTitle('login');

    // Assert - verify only bugs with 'login' in title are visible
    const loginBugs = workerBugData.filter(bug => bug.title.toLowerCase().includes('login'));
    const otherBugs = workerBugData.filter(bug => !bug.title.toLowerCase().includes('login'));

    for (const bug of loginBugs) {
      await expect(await boardPage.getBugCellByTitle(bug.title)).toBeVisible();
    }

    for (const bug of otherBugs) {
      await expect(await boardPage.getBugCellByTitle(bug.title)).not.toBeVisible();
    }
  });

  test('Search bugs by title with no matches', async ({ boardPage }) => {
    // Act
    await boardPage.searchByTitle('xyzzy');

    // Assert - no results message appears
    await expect(await boardPage.getNoResultsMessage()).toBeVisible();

    // All bugs should be hidden
    for (const bug of workerBugData) {
      await expect(await boardPage.getBugCellByTitle(bug.title)).not.toBeVisible();
    }
  });
});
