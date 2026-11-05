import { expect, test } from "./delete-bug.fixture";

test.describe("Delete Bug", () => {
  test("confirm-deletion-of-fresh-closed-bug", async ({
    boardPage,
    editBugModal,
    deleteBugTitle,
  }) => {
    // 1. Set the newly created bug to Closed.
    await boardPage.openBug(deleteBugTitle);
    await editBugModal.setState("Closed");
    await editBugModal.save();
    await expect(editBugModal.dialog).toBeHidden();
    await expect(boardPage.getBugRow(deleteBugTitle)).toHaveCount(0);

    // 2. Select Closed and open the bug by its unique title.
    await boardPage.filterByState("Closed");
    const row = boardPage.getBugRow(deleteBugTitle);
    await expect(row).toBeVisible();
    await boardPage.openBug(deleteBugTitle);
    await expect(editBugModal.dialog).toBeVisible();
    await expect(editBugModal.heading).toBeVisible();
    await expect(editBugModal.deleteButton).toBeVisible();

    // 3. Click Delete.
    await editBugModal.openDeleteConfirmation();
    await expect(editBugModal.deleteConfirmationDialog).toBeVisible();
    await expect(editBugModal.deleteConfirmationDialog).toContainText(
      /Are you sure you want to delete bug #\d+\?/
    );
    await expect(row).toBeVisible();

    // 4. Confirm deletion.
    await editBugModal.confirmDelete();
    await expect(editBugModal.deleteConfirmationDialog).toBeHidden();
    await expect(editBugModal.dialog).toBeHidden();
    await expect(row).toHaveCount(0);

    // 5. Reload the board and select Closed again.
    await boardPage.reload();
    await boardPage.filterByState("Closed");
    await expect(row).toHaveCount(0);
  });
});
