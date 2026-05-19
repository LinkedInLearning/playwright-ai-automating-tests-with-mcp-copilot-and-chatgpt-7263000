# Logout End-to-End Test Plan

## Overview

This suite validates authenticated sign-out behavior in BuggyBoard. It covers logout interaction, protected route enforcement after logout, browser navigation after logout, and session invalidation.

## Suite: Logout

### Seed
- `tests/seed.spec.ts`

## Scenarios

#### 1. Authenticated user can log out
- Sign in as a valid user.
- Navigate to the board page.
- Click the logout button in the title bar.
- Verify the app logs the user out.
- Verify the app redirects to `/login`.

#### 2. User cannot access protected pages after logout
- Sign in and then log out.
- Attempt to navigate to `/board`.
- Verify the app redirects to `/login`.

#### 3. Browser back button after logout does not restore session
- Sign in and then log out.
- Confirm the login page is visible.
- Use the browser back button.
- Verify the app does not restore the previous authenticated session.
- Verify the user stays on `/login` and remains unauthenticated.

#### 4. Logged-out user landing on protected page is redirected to login
- Sign in and log out.
- Use a direct URL to open a protected route such as `/board`.
- Verify the app redirects to `/login`.

## Notes
- Tests should assert the logout button is visible only after authentication.
- If there is a confirmation prompt for logout, include it in the logout scenario.
