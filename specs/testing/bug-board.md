# Bug Board End-to-End Test Plan

## Overview

This suite validates the main board page and bug table behavior. It covers table structure, bug row rendering, empty-state behavior, and severity formatting.

## Suite: Bug Board

### Seed
- `tests/seed.spec.ts`

## Scenarios

#### 1. Board page displays the bug table with correct columns
- Sign in as a valid user.
- Navigate to `/board`.
- Verify the table exists and has columns in the order: ID, Severity, Title, Owner.

#### 2. Board page shows all bugs from the database
- Ensure there are bugs in the database.
- Navigate to `/board`.
- Verify each bug row shows the bug's ID, severity, title, and owner.
- Verify the row count matches the number of bugs.

#### 3. Board page shows an empty table with no bugs
- Ensure the database contains no bugs.
- Navigate to `/board`.
- Verify the table is displayed.
- Verify there are no data rows in the table.

#### 4. Board page displays severity values in all caps
- Create or ensure a bug with severity `HIGH`, `MID`, or `LOW` exists.
- Navigate to `/board`.
- Verify the severity cell text is displayed as `HIGH`, `MID`, or `LOW`.

#### 5. Board table row click opens bug details
- Ensure a bug exists in the table.
- Click a bug row.
- Verify the edit bug modal opens with the selected bug's details.

## Notes
- This plan covers board page rendering and row-level navigation into bug details.
