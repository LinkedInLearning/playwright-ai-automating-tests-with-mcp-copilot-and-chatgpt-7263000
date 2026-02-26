# User Story

As a BuggyBoard user,
I want to delete bugs,
So that I can remove bugs that are incorrect or no longer needed.


# Design

- The "Edit bug" modal should have a "delete" button.
- Deleting a bug removes it from the database and closes the modal.


# Acceptance Criteria

Scenario: Edit bug modal displays a delete button
  Given the user is authenticated into the app
  And the user is on the board page
  And there are bugs in the database
  When the user opens the edit modal for a bug
  Then the modal displays a delete button

Scenario: Deleting a bug removes it from the database and closes the modal
  Given the user is authenticated into the app
  And the user is on the board page
  And there are bugs in the database
  When the user opens the edit modal for a bug
  And the user clicks the delete button
  Then the bug is removed from the database
  And the modal is closed
  And the board no longer displays that bug

