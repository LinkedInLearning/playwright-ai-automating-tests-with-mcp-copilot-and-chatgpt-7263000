import { test, expect } from "./fixtures/page-objects.fixture";

test("has title", async ({ page, homePage }) => {
  await homePage.goto();

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test("get started link", async ({ homePage }) => {
  await homePage.goto();

  // Click the get started link.
  await homePage.openGettingStartedGuide();

  // Expects page to have a heading with the name of Installation.
  await expect(homePage.installationHeading).toBeVisible();
});
