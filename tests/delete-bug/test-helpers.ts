import { Page, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BoardPage } from '../pages/BoardPage';
import { CreateBugModal } from '../pages/CreateBugModal';
import { EditBugModal } from '../pages/EditBugModal';

export async function login(page: Page) {
  const loginPage = new LoginPage(page);
  await loginPage.loginWithFirstUser();
}

export async function createBug(page: Page, title: string, boardPage?: BoardPage, createBugModal?: CreateBugModal) {
  const board = boardPage || new BoardPage(page);
  const modal = createBugModal || new CreateBugModal(page);

  await board.clickNewBugButton();
  await expect(modal.dialog).toBeVisible();
  await modal.fillBugForm({
    title,
    severity: 'mid',
    owner: 'tester',
    description: 'created by test',
  });
  await modal.submit();

  // wait for the table to contain the title
  const row = page.locator('table[aria-label="Bugs"] >> text=' + title).first();
  await row.waitFor({ state: 'visible', timeout: 5000 });
}

export async function deleteBugIfExists(page: Page, title: string, boardPage?: BoardPage, editBugModal?: EditBugModal) {
  const board = boardPage || new BoardPage(page);
  const modal = editBugModal || new EditBugModal(page);

  const locator = page.locator('table[aria-label="Bugs"] >> text=' + title);
  const count = await locator.count();
  if (count === 0) return;

  // click row to open edit modal
  await board.clickBugByTitle(title);
  await expect(modal.dialog).toBeVisible();
  await modal.delete();

  // wait until bug is gone
  await expect(locator).toHaveCount(0);
}

async function expectGone(locator: any) {
  await locator.waitFor({ state: 'detached', timeout: 5000 }).catch(() => { });
}
