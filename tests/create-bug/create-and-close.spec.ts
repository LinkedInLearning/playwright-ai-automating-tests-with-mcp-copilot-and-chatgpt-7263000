import { test, expect } from '@playwright/test';
import { mkdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { LoginPage } from '../pages/LoginPage';
import { BoardPage } from '../pages/BoardPage';
import { CreateBugModal } from '../pages/CreateBugModal';

test('create a bug then edit it to Closed and capture screenshots', async ({ page }) => {
  const screenshotsDir = join(process.cwd(), 'playwright-screenshots');
  mkdirSync(screenshotsDir, { recursive: true });

  // Read credentials from users.json (first user)
  const usersPath = join(process.cwd(), 'users.json');
  const usersRaw = readFileSync(usersPath, 'utf-8');
  const users = JSON.parse(usersRaw) as Array<{ username: string; password: string }>;
  const user = users[0];

  const login = new LoginPage(page);
  await login.goto();
  await login.login(user.username, user.password);
  await page.waitForURL('**/board');
  await page.screenshot({ path: join(screenshotsDir, '01-logged-in.png'), fullPage: true });

  const board = new BoardPage(page);
  await board.clickNewBugButton();
  await page.screenshot({ path: join(screenshotsDir, '02-create-modal-open.png') });

  const createModal = new CreateBugModal(page);
  const title = `e2e bug ${Date.now()}`;
  await createModal.fillBugForm({
    title,
    severity: 'high',
    owner: user.username,
    description: 'Created by automated test',
  });
  await page.screenshot({ path: join(screenshotsDir, '03-create-filled.png') });
  await createModal.submit();

  // Wait for the new bug to appear in the table
  const row = await board.getBugRowByTitle(title);
  await expect(row).toBeVisible();
  await page.screenshot({ path: join(screenshotsDir, '04-bug-created.png'), fullPage: true });

  // Open the bug for editing
  await board.clickBugByTitle(title);
  // Wait for edit dialog to appear
  await page.waitForSelector('[role="dialog"]');
  await page.screenshot({ path: join(screenshotsDir, '05-edit-modal-open.png') });

  // Change state to Closed (select in the edit dialog has id edit-bug-state)
  const stateSelect = page.locator('#edit-bug-state');
  await stateSelect.selectOption({ value: 'closed' });
  await page.screenshot({ path: join(screenshotsDir, '06-state-set-to-closed.png') });

  // Click Save in edit modal
  await page.getByRole('button', { name: 'Save' }).click();
  // Wait for modal to close and board to refresh
  await page.waitForSelector('[role="dialog"]', { state: 'hidden' });

  // Show Closed bugs and verify the bug appears there
  await page.getByRole('button', { name: 'Closed' }).click();
  // Wait a moment for fetch to complete
  await page.waitForTimeout(500);
  const closedRow = await board.getBugRowByTitle(title);
  await expect(closedRow).toBeVisible();
  await page.screenshot({ path: join(screenshotsDir, '07-bug-closed-in-board.png'), fullPage: true });
});
