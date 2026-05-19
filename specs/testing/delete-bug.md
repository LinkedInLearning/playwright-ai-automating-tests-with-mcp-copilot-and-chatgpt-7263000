# Delete Bug Test Plan

## Application Overview

Validate delete bug behavior for BuggyBoard, including the edit-modal delete button, confirmation modal flow, confirmed deletion, and cancel retention. Align tests to specs/features/12-delete-bug.md and keep tests independent, page-object-driven, and Playwright CLI runnable.

## Test Scenarios

### 1. Delete Bug

**Seed:** `tests/fixtures/pages.ts`

#### 1.1. should_create_then_delete_bug

**File:** `tests/delete-bug/should-create-then-delete.spec.ts`

**Steps:**
  1. -
    - expect: User logs in with a test account.
    - expect: A fresh bug is created during test setup and confirmed visible on the board.
  2. Open the created bug's edit modal.
    - expect: The edit modal is visible.
  3. Click the Delete button inside the edit modal.
    - expect: A delete confirmation modal is displayed.
  4. Confirm the deletion in the confirmation modal.
    - expect: The edit modal and confirmation modal are closed.
    - expect: The bug is removed from the database and no longer appears on the board.

#### 1.2. should_not_delete_when_cancelled

**File:** `tests/delete-bug/should-not-delete-when-cancelled.spec.ts`

**Steps:**
  1. -
    - expect: User logs in with a test account.
    - expect: A fresh bug is created during test setup and confirmed visible on the board.
  2. Open the created bug's edit modal.
    - expect: The edit modal is visible.
  3. Click the Delete button inside the edit modal.
    - expect: A delete confirmation modal is displayed.
  4. Cancel the delete confirmation.
    - expect: The confirmation modal closes.
    - expect: The edit modal remains open.
    - expect: The bug is not removed from the database.
    - expect: The bug remains visible on the board.

#### 1.3. should_delete_from_details_view

**File:** `tests/delete-bug/should-delete-from-details-view.spec.ts`

**Steps:**
  1. -
    - expect: User logs in with a test account.
    - expect: A fresh bug is created during test setup and confirmed visible on the board.
  2. Open the created bug's details/edit view from the board.
    - expect: The edit modal is visible.
  3. Click the Delete button and confirm the delete confirmation.
    - expect: The bug is removed from the database and no longer appears on the board.
    - expect: The edit modal closes.
