import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BoardPage } from '../pages/BoardPage';
import { CreateBugModal } from '../pages/CreateBugModal';
import { EditBugModal } from '../pages/EditBugModal';

// Declare fixture types for TypeScript support
type PagesFixtures = {
  loginPage: LoginPage;
  boardPage: BoardPage;
  createBugModal: CreateBugModal;
  editBugModal: EditBugModal;
};

// Create and export custom test function with fixtures
export const test = base.extend<PagesFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
    // Cleanup happens automatically
  },

  boardPage: async ({ page }, use) => {
    const boardPage = new BoardPage(page);
    await use(boardPage);
  },

  createBugModal: async ({ page }, use) => {
    const modal = new CreateBugModal(page);
    await use(modal);
  },

  editBugModal: async ({ page }, use) => {
    const modal = new EditBugModal(page);
    await use(modal);
  },
});

export { expect } from '@playwright/test';
