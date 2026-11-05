import { readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";

const users = JSON.parse(
  readFileSync(new URL("../users.json", import.meta.url), "utf8"),
) as { username: string; password: string }[];

test("logs in and creates a bug", async ({ page }) => {
  const user = users[0];
  if (!user) {
    throw new Error("No users are configured in users.json.");
  }

  const title = `Playwright-created bug ${Date.now()}`;

  await page.goto("/login");
  await page.getByLabel("Username").fill(user.username);
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/\/board$/);

  await page.getByRole("button", { name: "New Bug" }).click();
  const dialog = page.getByRole("dialog", { name: "Create bug" });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Title").fill(title);
  await dialog.getByLabel("Severity").selectOption("high");
  await dialog.getByLabel("Owner").fill(user.username);
  await dialog
    .getByLabel("Description")
    .fill("Created by the Playwright end-to-end test.");
  await dialog.getByRole("button", { name: "Save" }).click();

  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole("table", { name: "Bugs" }).getByText(title, { exact: true }),
  ).toBeVisible();
});
