# Delete Bug — Test Plan

## Overview

Purpose: Validate that users can delete bugs from the BuggyBoard app and that deletion behaves correctly (confirmed delete removes the bug; cancel leaves it intact).

Scope: End-to-end Playwright tests using Playwright CLI. Each test must create a fresh bug during setup so tests are independent and repeatable.

Preconditions:
- The application under test is running and reachable in the environment used by Playwright.
- A test account exists (use `users.json` test user or API-created credentials).

Test conventions:
- Tests follow Arrange — Act — Assert pattern.
- Setup MUST create a fresh bug via the UI or API before performing delete actions.
- Tests should be atomic and independent.

## Test Cases

1) Delete a single bug (atomic)

- Test name: should_create_then_delete_bug
- Purpose: Verify that a bug created during test setup can be deleted and no longer appears on the board.
- Preconditions (Arrange):
  - Start a fresh browser context and login using a test user.
  - Create a fresh bug as part of test setup. Prefer creating via the UI (Create Bug modal) to exercise real user flows; API creation is acceptable if UI creation proves flaky, but include an assertion that the bug exists on the board before delete step.
  - Use a distinctive title (e.g., `delete-bug-{timestamp}`) to avoid collisions.
- Steps (Act):
  1. Locate the created bug on the board and open its details or options menu.
  2. Trigger the delete action (click Delete/Delete button).
  3. Confirm the deletion in any confirmation dialog.
- Assertions (Assert):
  - The bug is no longer present on the board (search by title/ID).
  - If the app shows a success notification, assert its presence and message.

2) Cancel deletion should keep the bug

- Test name: should_not_delete_when_cancelled
- Purpose: Verify that cancelling a delete confirmation leaves the bug intact.
- Preconditions (Arrange):
  - Login and create a fresh bug as in test 1.
- Steps (Act):
  1. Trigger delete for the created bug.
  2. Dismiss/cancel the confirmation dialog.
- Assertions (Assert):
  - The bug remains visible on the board after the cancel action.

3) Delete via details view (optional)

- Test name: should_delete_from_details_view
- Purpose: Ensure deletion from a bug's details page removes it from the board.
- Preconditions (Arrange):
  - Create a fresh bug via UI setup.
- Steps (Act):
  1. Open the bug's details page.
  2. Use the Delete control inside the details page and confirm.
- Assertions (Assert):
  - Bug is absent from the board and details page closes.

## Test Implementation Notes

- Selector strategy: Prefer role or test-id locators (e.g., `getByRole('button', { name: 'Create Bug' })` or `getByTestId('create-bug')`). If selectors are flaky, use the snapshot refs or clear CSS selectors but keep them maintainable.
- Use timestamps or UUIDs in titles to guarantee uniqueness.
- Cleanup: Tests should rely on their own setup and deletion; do not assume global teardown will remove created test data.
- Flakiness: If UI creation is flaky, implement a robust retry/assertion pattern after creation to ensure the bug appears before attempting delete.

## Playwright CLI / Run commands

Use Playwright CLI to run these tests. Example:

```
npx playwright test tests/delete-bug --project=chromium
```

Or run a single test file:

```
npx playwright test tests/delete-bug/should-create-then-delete.spec.ts
```

## Files / Suggested test names

- `tests/delete-bug/should-create-then-delete.spec.ts`
- `tests/delete-bug/should-not-delete-when-cancelled.spec.ts`
- `tests/delete-bug/should-delete-from-details-view.spec.ts`

Each test file should create its own fresh bug during the test `beforeEach` (Arrange) and then perform the delete steps (Act/Assert).

---
Saved: specs/testing/delete-bug.md
