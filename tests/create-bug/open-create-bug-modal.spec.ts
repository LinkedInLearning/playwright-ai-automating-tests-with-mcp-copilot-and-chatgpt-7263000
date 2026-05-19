import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';

interface User { username: string; password: string }

test.describe('Create Bug - Open create-bug modal from board', () => {
  test('should open the create-bug modal from the board page', async ({ page }) => {
    const usersPath = join(process.cwd(), 'users.json');
    const rawUsers = readFileSync(usersPath, 'utf-8');
    const users = JSON.parse(rawUsers) as User[];
    const firstUser = users[0];

    await page.goto('/login');
    await page.getByLabel('Username').fill(firstUser.username);
    await page.getByLabel('Password').fill(firstUser.password);
    await page.getByRole('button', { name: 'Login' }).click();

    await page.waitForURL('**/board');
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'New Bug' })).toBeVisible();

    await page.getByRole('button', { name: 'New Bug' }).click();
    const dialog = page.getByRole('dialog', { name: 'Create bug' });

    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel('Title')).toBeVisible();
    await expect(dialog.getByLabel('Severity')).toBeVisible();
    await expect(dialog.getByLabel('Owner')).toBeVisible();
    await expect(dialog.getByLabel('Description')).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Save' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeVisible();
  });
});
