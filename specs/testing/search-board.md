# BuggyBoard Search Board End-to-End Test Plan

## Coverage Gap

The current search tests cover basic title matching, a lower-case query against
capitalized titles, and an unmatched query, but do not assert the blank-search
baseline, that Clear restores all rows, punctuation/whitespace normalization,
or preservation of the active sort.
`search-grand-tour.spec.ts` clicks Clear but does not assert the restored
results before starting its next query.

CLI exploration confirmed that “playwright created” matches titles containing
“Playwright-created” and that sorting remains active during that search.

## Test Scenarios

### 1. Search Board

**File:** `tests/search-bug/search-normalization.spec.ts`

#### 1.1. shows all bugs when search is blank

1. Seed several bugs with distinct titles and leave Search bugs by title blank.
   - expect: Every seeded open bug is visible.
   - expect: No no-results message or Clear search control is shown.

#### 1.2. normalizes punctuation and whitespace during matching

1. Seed titles including “Login fails” and “Issue with log-in”.
2. Search with a query that differs by punctuation or whitespace, such as
   “log in” or “login”.
   - expect: All titles matching the normalized query are visible.
   - expect: Titles that do not match are hidden.

#### 1.3. Clear restores the full result set

1. Enter a query that matches only part of the seeded set, then click Clear
   search.
   - expect: The search field is blank.
   - expect: All seeded bugs are visible again.

#### 1.4. preserves the selected sort while filtering

1. Sort by Title ascending and enter a query matching multiple seeded bugs.
   - expect: Only matching bugs remain visible in ascending title order.
   - expect: The Title sort indicator and direction are unchanged.

## Test Data and Isolation

- Use unique titles that include punctuation and case variations.
- Assert exact visible and hidden title sets after each search.
- Remove all test-owned records during teardown.
- Existing basic match and no-results cases remain in
  `tests/search-bug/search-atomic.spec.ts`.
