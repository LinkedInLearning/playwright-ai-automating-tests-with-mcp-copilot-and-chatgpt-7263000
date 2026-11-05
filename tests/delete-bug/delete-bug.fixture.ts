import { readFileSync } from "node:fs";
import { expect, test as pageObjectTest } from "../fixtures/page-objects.fixture";

const users = JSON.parse(
  readFileSync(new URL("../../users.json", import.meta.url), "utf8")
) as { username: string; password: string }[];

type DeleteBugFixtures = {
  deleteBugTitle: string;
};

export const test = pageObjectTest.extend<DeleteBugFixtures>({
  deleteBugTitle: async (
    { page, loginPage, boardPage, createBugModal, editBugModal },
    use,
    testInfo
  ) => {
    const user = users[0];
    if (!user) {
      throw new Error("No users are configured in users.json.");
    }

    await loginPage.goto();
    await loginPage.login(user.username, user.password);

    await expect(page).toHaveURL(/\/board$/);
    await expect(boardPage.newBugButton).toBeVisible();

    const title = `Delete test bug ${Date.now()} ${testInfo.testId}`;
    let created = false;
    try {
      await boardPage.openCreateBugModal();
      await expect(createBugModal.heading).toBeVisible();
      await createBugModal.fillBugForm({
        title,
        severity: "HIGH",
        owner: user.username,
        description: "Fresh test bug for delete coverage.",
      });
      await createBugModal.save();
      created = true;

      await expect(createBugModal.dialog).toBeHidden();
      await expect(boardPage.getBugRow(title)).toBeVisible();
      await use(title);
    } finally {
      if (created) {
        await boardPage.goto();
        await expect(boardPage.newBugButton).toBeVisible();

        for (const state of ["Open", "Closed"] as const) {
          await boardPage.filterByState(state);
          const row = boardPage.getBugRow(title);
          if (await row.count()) {
            await boardPage.openBug(title);
            await expect(editBugModal.deleteButton).toBeVisible();
            await editBugModal.deleteBug();
            await expect(editBugModal.deleteConfirmationDialog).toBeHidden();
            await expect(editBugModal.dialog).toBeHidden();
            await expect(row).toHaveCount(0);
            break;
          }
        }

        await expect(boardPage.getBugRow(title)).toHaveCount(0);
      }
    }
  },
});

export { expect };
