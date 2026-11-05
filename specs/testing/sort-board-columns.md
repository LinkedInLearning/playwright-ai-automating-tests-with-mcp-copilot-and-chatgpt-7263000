# BuggyBoard Sort Board Columns End-to-End Test Plan

## Coverage Gap

No current test covers sorting. CLI exploration showed that Severity is the
default active sort, indicated by a downward arrow, and clicking Title selects
ascending order followed by descending order on the next click.

## Test Scenarios

### 1. Sort Board Columns

**File:** `tests/sort-board/sort-board-columns.spec.ts`

#### 1.1. defaults to Severity descending

1. Create bugs with HIGH, MID, and LOW severity.
2. Navigate to the board.
   - expect: Rows are ordered HIGH, MID, LOW.
   - expect: Severity shows a down arrow and no other column has an indicator.

#### 1.2. sorts a newly selected column ascending

1. Click the Title column header.
   - expect: Titles are in ascending order.
   - expect: Title shows an up arrow and other columns show no indicator.

#### 1.3. toggles direction on the same column

1. With Title sorted ascending, click its header again.
   - expect: Titles are in descending order and Title shows a down arrow.

#### 1.4. activates only one sort column at a time

1. Sort by Owner, then click Severity.
   - expect: Severity becomes the only active sort column.
   - expect: Rows follow the selected severity order.

#### 1.5. orders severity in both directions

1. Click Severity once from its default descending state.
   - expect: Rows are ordered LOW, MID, HIGH.
2. Click Severity again.
   - expect: Rows are ordered HIGH, MID, LOW.

#### 1.6. supports sorting by every column

1. Click each of ID, Severity, Title, and Owner when it is not the active sort.
   - expect: Every column can become the active sort and displays an indicator.

## Test Data and Isolation

- Use controlled test values across all severity levels and distinct values for
  each sortable text field.
- Avoid asserting ordering among rows with equal sort values unless tie-breaking
  is explicitly specified.
- Remove all test-owned records during teardown.
