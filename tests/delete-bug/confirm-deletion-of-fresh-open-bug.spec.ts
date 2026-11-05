import { expect, test } from "./delete-bug.fixture";

test.describe("Delete Bug", () => {
  test("confirm-deletion-of-fresh-open-bug", async ({
    boardPage,
    editBugModal,
    deleteBugTitle,
  }) => {
    const row = boardPage.getBugRow(deleteBugTitle);

    // 1. Open the newly created bug by selecting its board row.
    await boardPage.openBug(deleteBugTitle);
    await expect(editBugModal.renderedDialog).toBeVisible();
    await expect(editBugModal.heading).toBeVisible();
    await expect(editBugModal.deleteButton).toBeVisible();

    // 2. Click Delete.
    await editBugModal.openDeleteConfirmation();
    await expect(editBugModal.deleteConfirmationDialog).toBeVisible();
    await expect(editBugModal.deleteConfirmationDialog).toContainText(
      /Are you sure you want to delete bug #\d+\?/
    );
    await expect(editBugModal.renderedDialog).toBeVisible();
    await expect(row).toBeVisible();

    // 3. Confirm deletion.
    await editBugModal.confirmDelete();
    await expect(editBugModal.deleteConfirmationDialog).toBeHidden();
    await expect(editBugModal.dialog).toBeHidden();
    await expect(row).toHaveCount(0);

    // 4. Reload the board.
    await boardPage.reload();
    await expect(row).toHaveCount(0);
  });
});
