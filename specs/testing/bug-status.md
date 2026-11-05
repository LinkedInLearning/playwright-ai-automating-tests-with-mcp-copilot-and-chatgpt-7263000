# BuggyBoard Bug Status End-to-End Test Plan

## Coverage Gap

The delete suite changes a test bug from Open to Closed and later opens it in
the Closed view, but no test independently validates the default Open filter,
status persistence, filtering in both directions, or interactions with search
and sorting. CLI exploration confirmed that Open is selected by default,
Closed can show the empty-state message, and a saved Closed bug appears only
when the Closed filter is selected.

## Test Scenarios

### 1. Bug Status

**File:** `tests/bug-status/bug-status.spec.ts`

#### 1.1. creates new bugs as Open

1. Create a bug through New Bug.
   - expect: It appears in the default Open view.
2. Select Closed.
   - expect: The new bug is not displayed.

#### 1.2. defaults the board filter to Open

1. Seed at least one Open bug and one Closed bug, then navigate to `/board`.
   - expect: Open is visibly selected.
   - expect: Only Open bugs are shown.

#### 1.3. filters to Closed bugs

1. Select Closed.
   - expect: Only Closed bugs are shown.
   - expect: Open bugs are not present in the result rows.

#### 1.4. persists a state change

1. Open an Open bug, change State to Closed, and save.
   - expect: The bug disappears from the Open list.
2. Select Closed and reload the board.
   - expect: The bug remains visible in Closed.
3. Change the bug back to Open and save.
   - expect: It is visible in Open and absent from Closed.

#### 1.5. combines state filtering with search and sorting

1. Select a state, sort the board by Title, and enter a query matching some
   bugs in that state.
   - expect: Only bugs matching both the state and title query are displayed.
   - expect: Matching rows retain the selected sort order.

#### 1.6. displays the empty state when a selected state has no bugs

1. Ensure there are no Closed bugs and select Closed.
   - expect: “No bugs matched.” is displayed and there are no bug rows.

## Test Data and Isolation

- Create a controlled mix of Open and Closed bugs with unique titles.
- Do not rely on shared database contents.
- Remove all test-owned records during teardown.
