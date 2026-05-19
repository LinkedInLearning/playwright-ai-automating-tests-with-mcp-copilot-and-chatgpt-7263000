# Sort Board Columns End-to-End Test Plan

## Overview

This suite validates sorting behavior on the BuggyBoard table. It covers default sort state, column header sorting, sort direction toggling, single active sort, and severity-specific ordering.

## Suite: Sort Board Columns

### Seed
- `tests/seed.spec.ts`

## Scenarios

#### 1. Board loads with default sort by severity descending
- Sign in as a valid user.
- Ensure bugs exist in the database with a mix of HIGH, MID, LOW severities.
- Navigate to `/board`.
- Verify bugs are listed in descending severity order: HIGH, then MID, then LOW.
- Verify the Severity column shows the descending sort indicator.
- Verify no other column shows a sort indicator.

#### 2. Click a column header to sort ascending
- On the board page, click the Title column header.
- Verify the Title header shows an ascending sort indicator.
- Verify bugs are ordered by title ascending.
- Verify only Title has a sort indicator.

#### 3. Toggle a column sort direction by clicking again
- Sort the Title column ascending.
- Click the Title column header again.
- Verify the Title header shows descending sort indicator.
- Verify bugs are ordered by title descending.

#### 4. Only one column is sorted at a time
- Sort by Owner.
- Then click Severity.
- Verify Severity now shows a sort indicator.
- Verify Owner no longer shows a sort indicator.
- Verify bugs are sorted by severity only.

#### 5. Severity ascending order is LOW, MID, HIGH
- Click the Severity header once.
- Verify bugs appear LOW first, then MID, then HIGH.

#### 6. Severity descending order is HIGH, MID, LOW
- Click the Severity header twice.
- Verify bugs appear HIGH first, then MID, then LOW.

#### 7. All columns are sortable
- Verify ID, Severity, Title, and Owner headers are clickable and activate sorting.
- Verify sorting controls appear and sort data when each header is clicked.

## Notes
- Use distinct bug titles and owners so ordering assertions are deterministic.
- If the UI uses arrows or icons for sort state, assert their presence on the correct header only.
