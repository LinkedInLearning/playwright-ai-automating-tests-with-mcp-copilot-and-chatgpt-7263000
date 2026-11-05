# BuggyBoard Edit Bug End-to-End Test Plan

## Coverage Gap

The existing delete tests open the Edit bug dialog and change State in one
deletion scenario, but they do not cover editing other fields, saving changes,
cancel behavior, modal dismissal, required-field handling, or ID immutability.
CLI exploration confirmed the dialog title includes the bug ID, the ID input is
read-only, and Save is disabled when no fields have changed.

## Test Scenarios

### 1. Edit Bug

**File:** `tests/edit-bug/edit-bug.spec.ts`

#### 1.1. opens a bug with its current values

1. Create a uniquely titled bug with known values and open its board row.
   - expect: A dialog headed “Edit bug #<id>” is visible.
   - expect: ID, Title, Severity, Owner, and Description show the saved values.
   - expect: ID is read-only; Title, Severity, Owner, and Description are
     editable.
   - expect: Severity offers HIGH, MID, and LOW and uses the board severity
     styling.

#### 1.2. saves changes to editable fields

1. Change the title, severity, owner, and description, then click Save.
   - expect: The dialog closes.
   - expect: The board displays the updated title, owner, and severity.
2. Reload the board and reopen the bug.
   - expect: All updated values, including the description, persist.

#### 1.3. keeps the original values when Cancel is clicked

1. Change one or more fields and click Cancel.
   - expect: The dialog closes without saving.
   - expect: The board and a subsequent reload show the original values.

#### 1.4. keeps the original values when Close or Escape is used

1. Change a field and click the upper-right Close control.
   - expect: The dialog closes and the change is discarded.
2. Reopen the bug, change a field, and press Escape.
   - expect: The dialog closes and the change is discarded.

#### 1.5. preserves edits when the backdrop is clicked

1. Change a field and click the dimmed backdrop outside the dialog.
   - expect: The dialog remains open and the edited value is unchanged.

#### 1.6. disables Save when changes are invalid or absent

1. Open a bug without changing any fields.
   - expect: Save is disabled.
2. Clear each required field in turn: Title, Severity, Owner, and Description.
   - expect: Save is disabled while any required field is blank.
3. Restore a valid value and change a field.
   - expect: Save becomes enabled.

## Test Data and Isolation

- Create a fresh bug per test with unique title and valid required values.
- Verify persistence through the board and by reopening the bug; clean up the
  test-owned record through the UI or API.
- Keep deletion-specific scenarios in `specs/testing/delete-bug.md`.
