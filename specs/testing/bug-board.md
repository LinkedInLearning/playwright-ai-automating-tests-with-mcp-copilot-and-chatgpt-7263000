# BuggyBoard Board End-to-End Test Plan

## Coverage Gap

Current tests use the board to locate bugs but do not validate the board's
table contract, row contents, or empty state. CLI exploration confirmed a
table named Bugs with ID, Severity, Title, and Owner columns, in that order.

## Test Scenarios

### 1. Board Contents

**File:** `tests/bug-board/bug-board.spec.ts`

#### 1.1. displays the required table columns in order

1. Authenticate and navigate to `/board`.
   - expect: The Bugs table is visible.
   - expect: Its columns are ID, Severity, Title, and Owner, in that order.

#### 1.2. displays every bug and its corresponding values

1. Create several uniquely titled bugs with known IDs, severities, and owners.
2. Navigate to the Open board view.
   - expect: There is one row for each seeded open bug.
   - expect: Each row's ID, severity, title, and owner match its record.
   - expect: Severity labels are displayed in uppercase.

#### 1.3. displays an empty table when there are no bugs

1. Start with an empty bug database and navigate to `/board`.
   - expect: The Bugs table and its column headers remain visible.
   - expect: The table has no data rows and no stale bug content.

## Test Data and Isolation

- Use a controlled database or create records through the existing API request
  fixture, recording each returned ID for teardown.
- Do not rely on records already present in the shared database.
- Delete all test-owned records even when an assertion fails.
