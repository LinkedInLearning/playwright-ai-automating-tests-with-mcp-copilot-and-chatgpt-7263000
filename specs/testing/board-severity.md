# BuggyBoard Board Severity End-to-End Test Plan

## Coverage Gap

No current test asserts severity color-coding or verifies that the board uses
the severity design tokens. CLI exploration confirmed that LOW is rendered as
a severity badge; its text color and tinted background are applied to the
badge span, not the table cell.

## Test Scenarios

### 1. Severity Styling

**File:** `tests/board-severity/board-severity.spec.ts`

#### 1.1. displays each severity with its design color

1. Create one open bug for each severity: HIGH, MID, and LOW.
2. Open the board.
   - expect: Each bug displays the correct uppercase severity label.
   - expect: HIGH uses `--color-severity-high` (`#b84a2e`).
   - expect: MID uses `--color-severity-mid` (`#a67c47`).
   - expect: LOW uses `--color-severity-low` (`#4a6b5e`).
   - expect: Each badge has a tinted background derived from its severity
     color, and the three severity levels are visually distinct.

#### 1.2. reuses severity tokens in the UI

1. Inspect the rendered severity badges and the computed CSS custom properties.
   - expect: Each badge's text styling corresponds to the matching severity
     token, rather than a hard-coded unrelated color.
   - expect: The background tint is consistent with the corresponding token.

## Test Data and Isolation

- Create one uniquely titled bug per severity and remove all test-owned records
  during teardown.
- Compare computed styles with resolved CSS custom properties so browser color
  serialization does not make the assertion brittle.
