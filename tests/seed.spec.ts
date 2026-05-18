import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';

interface User { username: string; password: string }

test.describe('Seed tests', () => {
  test('login with first user from users.json', { tag: '@seed'}, async ({ page }) => {
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
  });
});
