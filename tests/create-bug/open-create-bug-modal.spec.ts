import { readFileSync } from "node:fs";
import { test, expect } from "../fixtures/page-objects.fixture";

const users = JSON.parse(
  readFileSync(new URL("../../users.json", import.meta.url), "utf8")
) as { username: string; password: string }[];

test.describe("Create bug", () => {
  test("opens the create-bug modal with required fields and defaults", async ({
    page,
    boardPage,
    createBugModal,
    loginPage,
  }) => {
    const user = users[0];
    if (!user) {
      throw new Error("No users are configured in users.json.");
    }

    await loginPage.goto();
    await loginPage.login(user.username, user.password);

    await expect(page).toHaveURL(/\/board$/);
    await expect(boardPage.newBugButton).toBeVisible();
    await boardPage.openCreateBugModal();

    await expect(createBugModal.dialog).toBeVisible();
    await expect(createBugModal.heading).toBeVisible();
    await expect(createBugModal.titleInput).toBeVisible();
    await expect(createBugModal.severitySelect).toHaveValue("mid");
    await expect(
      createBugModal.severitySelect.locator("option:checked")
    ).toHaveText("MID");
    await expect(createBugModal.ownerInput).toHaveValue(user.username);
    await expect(createBugModal.descriptionInput).toBeVisible();
    await expect(createBugModal.saveButton).toBeVisible();
    await expect(createBugModal.cancelButton).toBeVisible();
    await expect(createBugModal.closeButton).toBeVisible();
  });
});
