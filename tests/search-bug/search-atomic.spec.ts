import { test, expect } from "../fixtures/page-objects.fixture";
import { searchBugs } from "../data/searchBugs";

const bugTitles = searchBugs.map(({ title }) => title);

test.describe("Search Bug", () => {
  let createdBugIds: number[] = [];

  test.beforeEach(async ({ page, request, loginPage, boardPage }) => {
    await loginPage.goto();
    await loginPage.login("buggy", "1970beetle");
    await expect(page).toHaveURL(/\/board$/);

    createdBugIds = [];
    for (const bug of searchBugs) {
      const response = await request.post("/api/bugs", { data: bug });
      const body: { id: number } = await response.json();
      createdBugIds.push(body.id);
    }

    await boardPage.reload();
  });

  test.afterEach(async ({ request }) => {
    for (const id of createdBugIds) {
      await request.delete(`/api/bugs/${id}`);
    }
    createdBugIds = [];
  });

  test("shows all bugs matching a title search", async ({ boardPage }) => {
    await boardPage.searchBugsByTitle("page");

    for (const title of bugTitles) {
      await expect(boardPage.getBugTitleCell(title)).toBeVisible();
    }
  });

  test("shows only bugs matching a login search", async ({ boardPage }) => {
    const loginBugTitles = bugTitles.filter((title) =>
      title.toLowerCase().includes("login")
    );

    await boardPage.searchBugsByTitle("login");

    for (const title of loginBugTitles) {
      await expect(boardPage.getBugTitleCell(title)).toBeVisible();
    }

    for (const title of bugTitles.filter(
      (title) => !loginBugTitles.includes(title)
    )) {
      await expect(boardPage.getBugTitleCell(title)).not.toBeVisible();
    }
  });

  test("shows a no-results message for an unmatched search", async ({
    boardPage,
  }) => {
    await boardPage.searchBugsByTitle("xyzzy");

    await expect(boardPage.noResultsMessage).toBeVisible();

    for (const title of bugTitles) {
      await expect(boardPage.getBugTitleCell(title)).not.toBeVisible();
    }
  });
});
