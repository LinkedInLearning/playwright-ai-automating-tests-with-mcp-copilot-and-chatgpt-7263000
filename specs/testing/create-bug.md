# Create Bug End-to-End Test Plan

## Overview

This suite covers the end-to-end behavior for creating a new bug in the BuggyBoard app. It verifies the authenticated board flow, create-bug modal interactions, required-field validation, save/cancel behavior, and modal close patterns.

## Suite: Create Bug

### Seed
- `tests/seed.spec.ts`

### Scenarios

#### 1. Open create-bug modal from board
- Navigate to the login page and authenticate with a valid user account.
- Verify login succeeds and the app navigates to the board page.
- Verify the board title bar is visible with a `New Bug` button.
- Click the `New Bug` button.
- Verify the create-bug modal is displayed.
- Verify the modal contains fields for title, severity, owner, and description.
- Verify the modal contains `Save` and `Cancel` buttons.

#### 2. Default owner is current user
- Open the create-bug modal while logged in as a known user.
- Verify the owner field is pre-filled with the logged-in username.
- Verify other required fields are empty or set to defaults.

#### 3. Save a new bug with valid data
- Open the create-bug modal.
- Fill title, severity, owner, and description with valid values.
- Verify fields accept input and severity can be selected.
- Click the `Save` button.
- Verify the modal closes.
- Verify a new bug is persisted and visible in the board bug list.

#### 4. Cancel create-bug modal without saving
- Open the create-bug modal and enter sample values.
- Click the `Cancel` button.
- Verify the modal closes.
- Verify no new bug is added to the board or database.

#### 5. Close create-bug modal with the X button
- Open the create-bug modal and enter sample values.
- Click the modal's X close button in the upper right corner.
- Verify the modal closes.
- Verify no new bug is saved.

#### 6. Close create-bug modal with Escape
- Open the create-bug modal and enter sample values.
- Press the `Escape` key.
- Verify the modal closes.
- Verify no new bug is saved.

#### 7. Backdrop click does not close the modal
- Open the create-bug modal and enter sample values.
- Click the dimmed backdrop outside the modal.
- Verify the modal remains open.
- Verify the entered values remain preserved.

#### 8. Validation blocks save when required fields are blank
- Open the create-bug modal.
- Leave one required field blank while filling the others.
- Attempt to save.
- Verify the save action is blocked.
- Verify the modal remains open.
- Verify the user sees a validation message for the blank field.
