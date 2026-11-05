# User Story

As a BuggyBoard user,
I want to delete bugs,
So that I can remove bugs that are incorrect or no longer needed.

# Design

- The "Edit bug" modal should have a "delete" button.
- Clicking Delete opens a confirmation modal without deleting the bug.
- The confirmation modal identifies the bug and offers confirmation and cancel actions.
- Confirming deletion removes the bug from the database, closes both modals, and removes the bug from the board.
- Canceling, closing with the X, or pressing Escape in the confirmation modal dismisses only that modal and leaves the bug unchanged.

# Acceptance Criteria

Scenario: Edit bug modal displays a delete button
  Given the user is authenticated into the app
  And the user is on the board page
  And there are bugs in the database
  When the user opens the edit modal for a bug
  Then the modal displays a delete button

Scenario: Clicking delete asks for confirmation without deleting the bug
  Given the user is authenticated into the app
  And the user is on the board page
  And there are bugs in the database
  When the user opens the edit modal for a bug
  And the user clicks the delete button
  Then a confirmation modal is displayed
  And the confirmation modal identifies the bug
  And the edit modal remains open behind the confirmation modal
  And the bug remains in the database
  And the board continues to display that bug

Scenario: Confirming deletion removes the bug
  Given the user is authenticated into the app
  And the user is on the board page
  And there are bugs in the database
  When the user opens the edit modal for a bug
  And the user clicks the delete button
  And the user confirms deletion
  Then the bug is removed from the database
  And the confirmation modal and edit modal are closed
  And the board no longer displays that bug

Scenario: Canceling deletion leaves the bug unchanged
  Given the user is authenticated into the app
  And the user is on the board page
  And there are bugs in the database
  When the user opens the edit modal for a bug
  And the user clicks the delete button
  And the user cancels the confirmation modal
  Then the confirmation modal is closed
  And the edit modal remains open
  And the bug remains in the database
  And the board continues to display that bug

Scenario: Closing the confirmation modal with Escape leaves the bug unchanged
  Given the user is authenticated into the app
  And the user is on the board page
  And there are bugs in the database
  When the user opens the edit modal for a bug
  And the user clicks the delete button
  And the user presses Escape
  Then the confirmation modal is closed
  And the edit modal remains open
  And the bug remains in the database
  And the board continues to display that bug
