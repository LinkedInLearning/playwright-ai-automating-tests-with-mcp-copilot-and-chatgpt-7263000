# Bug Status End-to-End Test Plan

## Overview

This suite validates bug state management and state filtering in BuggyBoard. It covers open/closed state persistence, edit-modal state updates, default state filter behavior, closed-state filtering, and interaction with search and sorting.

## Suite: Bug Status

### Seed
- `tests/seed.spec.ts`

## Scenarios

#### 1. New bugs are created with state Open
- Sign in as a valid user.
- Create a new bug via the New Bug modal.
- Verify the bug is saved with state Open.
- Verify the bug appears when the state filter is set to Open.

#### 2. Edit bug modal displays state and allows changing it
- Ensure a bug exists.
- Open the bug from the board.
- Verify the edit modal shows the bug's state field.
- Change the state from Open to Closed.
- Save the bug.
- Verify the bug state is updated in the database.

#### 3. Board state filter defaults to Open
- Sign in as a valid user.
- Ensure there are open and closed bugs.
- Navigate to `/board`.
- Verify Open is selected by default in the state filter.
- Verify only open bugs are displayed.

#### 4. Selecting Closed shows only closed bugs
- Ensure there are both open and closed bugs.
- Select Closed in the state filter.
- Verify only closed bugs are displayed.
- Verify no open bugs are visible.

#### 5. Sorting works with a state filter applied
- Select a state filter such as Open.
- Sort the board by a column (e.g. Title ascending).
- Verify only bugs matching the selected state are displayed.
- Verify those bugs are sorted as requested.

#### 6. Search and state filter apply together
- Select a state filter (Open or Closed).
- Enter a search query.
- Verify the board displays only bugs that match both the state and the search text.

#### 7. No bugs matched message when selected state has no bugs
- Ensure the selected state filter has no matching bugs.
- Navigate to `/board`.
- Verify the board displays a no-results message.
- Verify the bug table has no rows.

## Notes
- If the app does not yet support bug state changes in the create modal, focus these tests on the edit modal and state filter.
- Use deterministic bug data so Open/Closed filtering expectations are clear.
