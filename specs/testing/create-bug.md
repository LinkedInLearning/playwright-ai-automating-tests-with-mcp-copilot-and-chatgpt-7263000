# BuggyBoard Create Bug End-to-End Test Plan

## Application Overview

Plan for the BuggyBoard create-bug modal on the authenticated board. Playwright MCP exploration confirmed the New Bug button, dialog name, accessible field names (Title, Severity, Owner, Description), Close/Cancel/Save controls, default MID severity, and default owner from the signed-in user. Blank submission displays a role=alert list with “Title is required.” and “Description is required.” while keeping the modal open. Saving valid data closes the modal and adds a visible bug entry to the Bugs table. The current Severity select has only HIGH, MID, and LOW options and defaults to MID, so an empty severity cannot be selected through the current UI; do not model an impossible blank-severity interaction without a product change. Use unique titles and confirm persistence through the board after reload; tests should verify no entry for dismissed or invalid drafts.

## Test Scenarios

### 1. Create Bug

**Seed:** `tests/seed.spec.ts`

#### 1.1. opens the create-bug modal with required fields and defaults

**File:** `tests/create-bug/open-create-bug-modal.spec.ts`

**Steps:**
  1. Use the seed test to authenticate as the first configured user, then open the board.
    - expect: The app is on /board and the New Bug button is visible.
  2. Click the New Bug button.
    - expect: A dialog named Create bug is visible.
  3. Inspect the labeled form controls and buttons.
    - expect: Title, Severity, Owner, and Description controls are present, along with Save, Cancel, and a Close button.
    - expect: Severity defaults to MID and Owner is prefilled with the signed-in user's username.

#### 1.2. creates and persists a bug with valid details

**File:** `tests/create-bug/create-bug-success.spec.ts`

**Steps:**
  1. Open the Create bug dialog from the authenticated board.
    - expect: The Create bug dialog is visible.
  2. Fill a unique title containing punctuation, choose HIGH, keep or fill the Owner, and enter a description containing < and >.
    - expect: All required fields contain the intended values.
  3. Click Save and wait for the create request to complete.
    - expect: The dialog closes.
    - expect: The bug appears in the Bugs table with the unique title, HIGH severity, and expected owner.
    - expect: The created record contains the supplied description; verify from the create response or supported detail view.
  4. Reload the board.
    - expect: The created bug remains visible, demonstrating persistence.

#### 1.3. creates bugs with every available severity

**File:** `tests/create-bug/create-bug-severities.spec.ts`

**Steps:**
  1. For each option HIGH, MID, and LOW, open New Bug, fill a unique title and valid owner and description, choose the severity, then save.
    - expect: Each save closes the dialog.
    - expect: Each resulting board entry shows the matching severity in uppercase and the unique title.

#### 1.4. blocks saving when a required text field is blank or whitespace

**File:** `tests/create-bug/create-bug-required-fields.spec.ts`

**Steps:**
  1. For Title, Owner, and Description in turn, open the dialog, provide valid values for the other fields, leave the selected field empty (and in a separate variation enter only whitespace), then click Save.
    - expect: The dialog remains open.
    - expect: A role=alert identifies the missing field (for example, Title is required.).
    - expect: No bug with that attempt's unique title is created in the Bugs table or after reload.
  2. Inspect the Severity selector's available choices.
    - expect: The selector offers HIGH, MID, and LOW and defaults to MID; record that a blank-severity case is not currently reachable from the UI.

#### 1.5. cancels a draft without saving

**File:** `tests/create-bug/dismiss-create-bug.spec.ts`

**Steps:**
  1. Open the dialog, fill a unique draft title and description, then click Cancel.
    - expect: The dialog closes.
    - expect: No bug with the draft title appears on the board, including after reload.

#### 1.6. closes the draft with the upper-right Close control

**File:** `tests/create-bug/dismiss-create-bug.spec.ts`

**Steps:**
  1. Open the dialog, fill a unique draft title and description, then click the button named Close.
    - expect: The dialog closes.
    - expect: No bug with the draft title appears on the board, including after reload.

#### 1.7. closes the draft with Escape

**File:** `tests/create-bug/dismiss-create-bug.spec.ts`

**Steps:**
  1. Open the dialog, fill a unique draft title and description, then press Escape.
    - expect: The dialog closes.
    - expect: No bug with the draft title appears on the board, including after reload.

#### 1.8. keeps the draft open when clicking the backdrop

**File:** `tests/create-bug/dismiss-create-bug.spec.ts`

**Steps:**
  1. Open the dialog and fill a unique title plus other form data. Click the dimmed backdrop outside the dialog.
    - expect: The dialog stays open.
    - expect: The title and other entered values remain unchanged.
