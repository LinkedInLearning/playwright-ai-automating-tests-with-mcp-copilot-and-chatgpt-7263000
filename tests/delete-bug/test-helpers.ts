import { Page } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';

interface User { username: string; password: string }

export async function login(page: Page) {
  const usersPath = join(process.cwd(), 'users.json');
  const rawUsers = readFileSync(usersPath, 'utf-8');
  const users = JSON.parse(rawUsers) as User[];
  const firstUser = users[0];

  await page.goto('/login');
  await page.getByLabel('Username').fill(firstUser.username);
  await page.getByLabel('Password').fill(firstUser.password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**/board');
}

export async function createBug(page: Page, title: string) {
  await page.getByRole('button', { name: 'New Bug' }).click();
  const dialog = page.getByRole('dialog', { name: 'Create bug' });
  await expectVisible(dialog);
  await dialog.getByLabel('Title').fill(title);
  await dialog.getByLabel('Severity').selectOption('mid');
  await dialog.getByLabel('Owner').fill('tester');
  await dialog.getByLabel('Description').fill('created by test');
  await dialog.getByRole('button', { name: 'Save' }).click();
  // wait for the table to contain the title
  const row = page.locator('table[aria-label="Bugs"] >> text=' + title).first();
  await row.waitFor({ state: 'visible', timeout: 5000 });
}

export async function deleteBugIfExists(page: Page, title: string) {
  const locator = page.locator('table[aria-label="Bugs"] >> text=' + title);
  const count = await locator.count();
  if (count === 0) return;
  // click row then delete from edit modal
  const row = page.locator('table[aria-label="Bugs"] tbody tr', { hasText: title }).first();
  await row.click();
  const dialog = page.getByRole('dialog', { name: /Edit bug/ });
  const deleteButton = dialog.getByRole('button', { name: 'Delete' });
  await deleteButton.click();
  // wait until bug is gone
  await expectGone(page.locator('table[aria-label="Bugs"] >> text=' + title));
}

async function expectVisible(locator: any) {
  await locator.waitFor({ state: 'visible', timeout: 5000 });
}

async function expectGone(locator: any) {
  await locator.waitFor({ state: 'detached', timeout: 5000 }).catch(() => { });
}
