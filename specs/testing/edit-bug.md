# Edit Bug End-to-End Test Plan

## Overview

This suite validates the edit bug modal and bug update behavior. It covers opening a bug from the board, viewing and editing fields, save/cancel behavior, modal close interactions, and form state.

## Suite: Edit Bug

### Seed
- `tests/seed.spec.ts`

## Scenarios

#### 1. Open a bug from the board row
- Sign in as a valid user.
- Ensure a bug exists in the table.
- Click the bug row.
- Verify the edit bug modal opens.
- Verify the modal title includes the bug ID (e.g. `Edit bug #1`).
- Verify the modal shows read-only bug ID and editable title, severity, owner, and description fields.

#### 2. Edit a bug and save changes
- Open the edit bug modal for a bug.
- Modify one or more editable fields.
- Click Save.
- Verify the modal closes.
- Verify the updated bug values are visible on the board.

#### 3. Cancel edit without saving changes
- Open the edit bug modal.
- Modify one or more fields.
- Click Cancel.
- Verify the modal closes.
- Verify the board still shows the original bug values.

#### 4. Close edit modal with the X button
- Open the edit bug modal.
- Modify one or more fields.
- Click the modal close button.
- Verify the modal closes.
- Verify the bug is unchanged.

#### 5. Close edit modal with Escape
- Open the edit bug modal.
- Modify one or more fields.
- Press Escape.
- Verify the modal closes.
- Verify the bug is unchanged.

#### 6. Backdrop click does not close the edit modal
- Open the edit bug modal.
- Modify one or more fields.
- Click outside the modal backdrop.
- Verify the modal remains open.
- Verify entered data is preserved.

#### 7. Save is disabled when there are no changes
- Open the edit bug modal.
- Do not change any fields.
- Verify the Save button is disabled.

#### 8. Save is disabled when required fields are blank
- Open the edit bug modal.
- Clear a required field such as title, severity, owner, or description.
- Verify the Save button is disabled.
- Verify the user cannot save until the field is restored.

## Notes
- These tests focus on edit modal user flows; bug state filtering is covered separately in bug-status tests.
