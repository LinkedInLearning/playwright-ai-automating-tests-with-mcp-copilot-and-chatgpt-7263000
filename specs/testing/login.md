# Login End-to-End Test Plan

## Overview

This suite validates BuggyBoard authentication behavior at the login page and protected-route gating. It covers page rendering, successful login, invalid credentials, blank-field validation, Enter-key submission, trimming whitespace, redirect behavior, and session persistence.

## Suite: Login

### Seed
- `tests/seed.spec.ts`

## Scenarios

#### 1. Login page renders correctly
- Navigate to `/login` with no authenticated session.
- Verify the login page is displayed.
- Verify the page shows username and password fields, and a login button.
- Verify the password field masks input.

#### 2. Redirect unauthenticated user to login when accessing protected pages
- Open `/board` without signing in.
- Verify the app redirects to `/login`.

#### 3. Valid login redirects to board
- Enter valid credentials from `users.json`.
- Click the login button.
- Verify the app authenticates and navigates to `/board`.

#### 4. Submit login with Enter from username field
- Open the login page.
- Fill a valid username and password.
- Press Enter while focused in the username field.
- Verify login succeeds and the app navigates to `/board`.

#### 5. Submit login with Enter from password field
- Open the login page.
- Fill a valid username and password.
- Press Enter while focused in the password field.
- Verify login succeeds and the app navigates to `/board`.

#### 6. Invalid username shows generic error
- Open the login page.
- Enter a username not in `users.json` and any password.
- Click the login button.
- Verify the user is not authenticated.
- Verify the page shows a generic login failure error.

#### 7. Invalid password shows generic error
- Open the login page.
- Enter a valid username and invalid password.
- Click the login button.
- Verify the user is not authenticated.
- Verify the page shows a generic login failure error.

#### 8. Blank username shows validation error
- Open the login page.
- Leave username blank and enter a valid password.
- Click the login button.
- Verify the user is not authenticated.
- Verify an error message indicates the username is required.

#### 9. Blank password shows validation error
- Open the login page.
- Enter a valid username and leave password blank.
- Click the login button.
- Verify the user is not authenticated.
- Verify an error message indicates the password is required.

#### 10. Blank username and password shows validation error
- Open the login page.
- Leave both username and password blank.
- Click the login button.
- Verify the user is not authenticated.
- Verify an error message indicates credentials are missing.

#### 11. Username whitespace is trimmed on login
- Open the login page.
- Enter a valid username with leading/trailing spaces and the correct password.
- Click the login button.
- Verify the app trims whitespace and login succeeds.

#### 12. Authenticated user loading login page is redirected to board
- Sign in as a valid user.
- Navigate to `/login`.
- Verify the app redirects to `/board`.

#### 13. Authenticated session persists on refresh
- Sign in as a valid user.
- Refresh the board page.
- Verify the user remains authenticated and stays on `/board`.

## Notes
- Prefer UI-driven login flows for coverage, but keep the test independent and repeatable.
- Use the test account data from `users.json`.
