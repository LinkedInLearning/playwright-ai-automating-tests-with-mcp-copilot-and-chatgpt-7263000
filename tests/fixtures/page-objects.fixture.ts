import { test as base, expect } from "@playwright/test";
import { BoardPage } from "../pages/BoardPage";
import { CreateBugModal } from "../pages/CreateBugModal";
import { EditBugModal } from "../pages/EditBugModal";
import { LoginPage } from "../pages/LoginPage";
import { PlaywrightHomePage } from "../pages/PlaywrightHomePage";

type PageObjectFixtures = {
  boardPage: BoardPage;
  createBugModal: CreateBugModal;
  editBugModal: EditBugModal;
  loginPage: LoginPage;
  homePage: PlaywrightHomePage;
};

export const test = base.extend<PageObjectFixtures>({
  boardPage: async ({ page }, use) => {
    await use(new BoardPage(page));
  },
  createBugModal: async ({ page }, use) => {
    await use(new CreateBugModal(page));
  },
  editBugModal: async ({ page }, use) => {
    await use(new EditBugModal(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new PlaywrightHomePage(page));
  },
});

export { expect };
