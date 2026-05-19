# User Story

As a BuggyBoard user,
I want to delete bugs,
So that I can remove bugs that are incorrect or no longer needed.


# Design

- The "Edit bug" modal should have a "delete" button.
- Clicking delete opens a confirmation modal before the bug is removed.
- Confirming the delete removes the bug from the database, closes the modals, and updates the board.
- Canceling the confirmation modal leaves the bug intact and returns the user to the edit modal.


# Acceptance Criteria

Scenario: Edit bug modal displays a delete button
  Given the user is authenticated into the app
  And the user is on the board page
  And there are bugs in the database
  When the user opens the edit modal for a bug
  Then the modal displays a delete button

Scenario: Deleting a bug shows a confirmation modal
  Given the user is authenticated into the app
  And the user is on the board page
  And there are bugs in the database
  When the user opens the edit modal for a bug
  And the user clicks the delete button
  Then a delete confirmation modal is displayed
  When the user confirms deletion
  Then the bug is removed from the database
  And the modal is closed
  And the board no longer displays that bug

Scenario: Canceling delete confirmation keeps the bug
  Given the user is authenticated into the app
  And the user is on the board page
  And there are bugs in the database
  When the user opens the edit modal for a bug
  And the user clicks the delete button
  Then a delete confirmation modal is displayed
  When the user cancels the confirmation
  Then the confirmation modal closes
  And the edit modal remains open
  And the bug is not removed from the database
  And the board still displays that bug

