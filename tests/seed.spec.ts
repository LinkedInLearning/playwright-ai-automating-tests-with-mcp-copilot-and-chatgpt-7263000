import { readFileSync } from "node:fs";
import { test, expect } from "./fixtures/page-objects.fixture";

const users = JSON.parse(
  readFileSync(new URL("../users.json", import.meta.url), "utf8")
) as { username: string; password: string }[];

test.describe("BuggyBoard login", () => {
  test(
    "logs in with the first configured user",
    { tag: "@seed" },
    async ({ page, loginPage, boardPage }) => {
      const user = users[0];
      if (!user) {
        throw new Error("No users are configured in users.json.");
      }

      await loginPage.goto();
      await loginPage.login(user.username, user.password);

      await expect(page).toHaveURL(/\/board$/);
      await expect(boardPage.newBugButton).toBeVisible();
    }
  );
});
