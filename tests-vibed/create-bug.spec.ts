import { test, expect } from '@playwright/test';
import users from '../users.json' with { type: 'json' };

const user = users[0];

test('logs in and creates a new bug', async ({ page }) => {
  const bugTitle = 'Playwright test bug';
  const bugDescription = 'Created by an automated test.';
  const bugOwner = user.username;

  await page.goto('/login');
  await page.fill('#username', user.username);
  await page.fill('#password', user.password);
  await page.click('button:has-text("Login")');

  await expect(page).toHaveURL(/\/board$/);
  await expect(page.getByRole('button', { name: 'New Bug' })).toBeVisible();

  await page.click('button:has-text("New Bug")');
  const dialog = page.getByRole('dialog', { name: 'Create bug' });
  await expect(dialog).toBeVisible();

  await dialog.locator('#bug-title').fill(bugTitle);
  await dialog.locator('#bug-severity').selectOption('high');
  await dialog.locator('#bug-owner').fill(bugOwner);
  await dialog.locator('#bug-description').fill(bugDescription);
  await dialog.getByRole('button', { name: 'Save' }).click();

  await expect(dialog).toBeHidden();
  await expect(
    page.locator('table[aria-label="Bugs"] td', { hasText: bugTitle }).first()
  ).toBeVisible();
});
