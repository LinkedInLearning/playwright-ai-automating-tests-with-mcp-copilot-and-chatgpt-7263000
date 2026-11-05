import { test, expect } from "../fixtures/page-objects.fixture";
import { searchBugs } from "../data/searchBugs";

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

  test("Search bugs by title on the board page", async ({ boardPage }) => {
    await boardPage.searchBugsByTitle("page");

    for (const bug of searchBugs) {
      await expect(boardPage.getBugTitleCell(bug.title)).toBeVisible();
    }

    await boardPage.clearTitleSearch();
    await boardPage.searchBugsByTitle("login");

    const loginBugTitles = searchBugs
      .filter(({ title }) => title.toLowerCase().includes("login"))
      .map(({ title }) => title);
    for (const title of loginBugTitles) {
      await expect(boardPage.getBugTitleCell(title)).toBeVisible();
    }

    for (const bug of searchBugs.filter(
      ({ title }) => !loginBugTitles.includes(title)
    )) {
      await expect(boardPage.getBugTitleCell(bug.title)).not.toBeVisible();
    }

    await boardPage.clearTitleSearch();
    await boardPage.searchBugsByTitle("xyzzy");

    await expect(boardPage.noResultsMessage).toBeVisible();

    for (const bug of searchBugs) {
      await expect(boardPage.getBugTitleCell(bug.title)).not.toBeVisible();
    }
  });
});
