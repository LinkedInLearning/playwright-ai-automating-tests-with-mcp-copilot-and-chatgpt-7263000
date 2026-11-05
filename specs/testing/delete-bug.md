# BuggyBoard Delete Bug End-to-End Test Plan

## Application Overview

Plan for deleting bugs from the authenticated BuggyBoard board. The Edit bug dialog contains a Delete button that opens a confirmation dialog. Users can confirm deletion or dismiss that dialog with Cancel, its X button, or Escape. Each scenario creates its own uniquely titled bug through the UI before exercising deletion, rather than selecting a pre-existing record. Verify dismissal preserves the bug and confirmed deletion persists after reload.

## Test Scenarios

### 1. Delete Bug

**Seed:** `tests/seed.spec.ts` (authenticate as the first configured user and open `/board`)

#### 1.1. confirm-deletion-of-fresh-open-bug

**File:** `tests/delete-bug/confirm-deletion-of-fresh-open-bug.spec.ts`

**Setup:**
  1. Authenticate and open the board.
    - expect: The app is on `/board` and the New Bug button is visible.
  2. Create a fresh bug using New Bug. Give it a unique title for this test, retain or select a valid severity, enter a valid owner and description, and save it.
    - expect: The create dialog closes and the Bugs table displays the bug with the unique title.

**Steps:**
  1. Open the newly created bug by selecting its board row.
    - expect: The Edit bug dialog is visible for the newly created bug.
    - expect: The dialog displays a Delete button.
  2. Click Delete.
    - expect: A confirmation dialog appears and identifies the bug.
    - expect: The Edit bug dialog remains open behind the confirmation.
    - expect: The bug remains visible in the Bugs table.
  3. Confirm deletion.
    - expect: Both dialogs close.
    - expect: The Bugs table no longer displays the bug with the unique title.
  4. Reload the board.
    - expect: The deleted bug remains absent, confirming the deletion persisted.

#### 1.2. confirm-deletion-of-fresh-closed-bug

**File:** `tests/delete-bug/confirm-deletion-of-fresh-closed-bug.spec.ts`

**Setup:**
  1. Authenticate and open the board.
    - expect: The app is on `/board`.
  2. Create a fresh bug with a unique title for this test, valid severity, owner, and description.
    - expect: The newly created bug appears in the Bugs table.
  3. Open that bug, set its State to Closed, and save.
    - expect: The edit dialog closes and the bug is no longer listed under Open.

**Steps:**
  1. Select the Closed filter and open the newly created bug by its unique title.
    - expect: The bug appears under Closed and its Edit bug dialog is visible.
    - expect: The dialog displays a Delete button.
  2. Click Delete.
    - expect: A confirmation dialog appears and the bug remains visible in the Bugs table.
  3. Confirm deletion.
    - expect: Both dialogs close.
    - expect: The bug with the unique title is absent from the Closed list.
  4. Reload the board and select Closed again if necessary.
    - expect: The deleted bug remains absent.

#### 1.3. cancel-deletion-preserves-fresh-bug

**File:** `tests/delete-bug/cancel-deletion-preserves-fresh-bug.spec.ts`

**Setup:**
  1. Authenticate and open the board, then create a fresh bug with a unique title, valid severity, owner, and description.
    - expect: The newly created bug appears in the Bugs table.

**Steps:**
  1. Open the newly created bug by selecting its board row.
    - expect: The Edit bug dialog is visible and includes a Delete button.
  2. Click Delete, then Cancel in the confirmation dialog.
    - expect: The confirmation dialog closes while the Edit bug dialog remains open.
    - expect: The bug remains in the Bugs table.
  3. Reload the board.
    - expect: The bug remains visible.
  4. Remove the test-owned bug during teardown by opening it again and confirming deletion.
    - expect: Both dialogs close and the test-owned bug is absent from the board.

#### 1.4. close-button-preserves-fresh-bug

**File:** `tests/delete-bug/close-button-preserves-fresh-bug.spec.ts`

**Setup:**
  1. Authenticate and open the board, then create a fresh bug with a unique title, valid severity, owner, and description.
    - expect: The newly created bug appears in the Bugs table.

**Steps:**
  1. Open the newly created bug by selecting its board row.
    - expect: The Edit bug dialog is visible and includes a Delete button.
  2. Click Delete, then click the confirmation dialog's X close button.
    - expect: The confirmation dialog closes while the Edit bug dialog remains open.
    - expect: The bug remains in the Bugs table.
  3. Reload the board.
    - expect: The bug remains visible.
  4. Remove the test-owned bug during teardown by opening it again and confirming deletion.
    - expect: Both dialogs close and the test-owned bug is absent from the board.

#### 1.5. escape-preserves-fresh-bug

**File:** `tests/delete-bug/escape-preserves-fresh-bug.spec.ts`

**Setup:**
  1. Authenticate and open the board, then create a fresh bug with a unique title, valid severity, owner, and description.
    - expect: The newly created bug appears in the Bugs table.

**Steps:**
  1. Open the newly created bug by selecting its board row.
    - expect: The Edit bug dialog is visible and includes a Delete button.
  2. Click Delete, then press Escape.
    - expect: The confirmation dialog closes while the Edit bug dialog remains open.
    - expect: The bug remains in the Bugs table.
  3. Reload the board.
    - expect: The bug remains visible.
  4. Remove the test-owned bug during teardown by opening it again and confirming deletion.
    - expect: Both dialogs close and the test-owned bug is absent from the board.

## Test Data and Isolation

- Create a new bug through the UI in each scenario; do not rely on seeded bugs or a fixed database ID.
- Use a unique title per test run so the intended row can be located unambiguously.
- Use valid required values for severity, owner, and description.
- Do not share a created bug between tests. Each test owns its setup record; remove any record left by a non-delete scenario during teardown.
