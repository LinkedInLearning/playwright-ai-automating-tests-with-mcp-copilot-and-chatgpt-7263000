import { test, expect } from '@playwright/test';
import { mkdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { LoginPage } from '../pages/LoginPage';
import { BoardPage } from '../pages/BoardPage';
import { CreateBugModal } from '../pages/CreateBugModal';

test('create a bug then edit it to Closed and record a video', async ({ browser }, testInfo) => {
  const videosDir = join(process.cwd(), 'playwright-videos');
  mkdirSync(videosDir, { recursive: true });

  const context = await browser.newContext({
    recordVideo: { dir: videosDir, size: { width: 1280, height: 720 } },
  });
  const page = await context.newPage();

  // Read credentials from users.json
  const usersPath = join(process.cwd(), 'users.json');
  const usersRaw = readFileSync(usersPath, 'utf-8');
  const users = JSON.parse(usersRaw) as Array<{ username: string; password: string }>;
  const user = users[0];

  const login = new LoginPage(page);
  await login.goto();
  await login.login(user.username, user.password);

  const board = new BoardPage(page);
  await board.clickNewBugButton();

  const createModal = new CreateBugModal(page);
  const title = `e2e video bug ${Date.now()}`;
  await createModal.fillBugForm({
    title,
    severity: 'mid',
    owner: user.username,
    description: 'Created by automated video test',
  });
  await createModal.submit();

  const row = await board.getBugRowByTitle(title);
  await expect(row).toBeVisible();

  // Open the bug for editing
  await board.clickBugByTitle(title);
  await page.waitForSelector('[role="dialog"]');

  // Change state to Closed using the edit modal select
  const stateSelect = page.locator('#edit-bug-state');
  await stateSelect.selectOption({ value: 'closed' });

  // Save
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForSelector('[role="dialog"]', { state: 'hidden' });

  // Show Closed bugs
  await page.getByRole('button', { name: 'Closed' }).click();
  await page.waitForTimeout(500);

  // Close the page to finalize the video
  await page.close();
  const videoPath = await page.video()!.path();
  await context.close();

  // Assert the video file exists
  expect(videoPath).toBeTruthy();
  expect(existsSync(videoPath)).toBe(true);

  // Log path for visibility in test output
  console.log('Recorded video:', videoPath);
});
