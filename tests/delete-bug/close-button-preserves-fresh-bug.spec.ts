import { expect, test } from "./delete-bug.fixture";

test.describe("Delete Bug", () => {
  test("close-button-preserves-fresh-bug", async ({
    boardPage,
    editBugModal,
    deleteBugTitle,
  }) => {
    const row = boardPage.getBugRow(deleteBugTitle);

    // 1. Open the newly created bug by selecting its board row.
    await boardPage.openBug(deleteBugTitle);
    await expect(editBugModal.dialog).toBeVisible();
    await expect(editBugModal.deleteButton).toBeVisible();

    // 2. Click Delete, then click the confirmation dialog's X close button.
    await editBugModal.openDeleteConfirmation();
    await expect(editBugModal.deleteConfirmationDialog).toBeVisible();
    await expect(editBugModal.deleteConfirmationDialog).toContainText(
      /Are you sure you want to delete bug #\d+\?/
    );
    await expect(row).toBeVisible();
    await editBugModal.closeDeleteConfirmation();
    await expect(editBugModal.deleteConfirmationDialog).toBeHidden();
    await expect(editBugModal.dialog).toBeVisible();
    await expect(row).toBeVisible();

    // 3. Reload the board.
    await boardPage.reload();
    await expect(row).toBeVisible();
  });
});
