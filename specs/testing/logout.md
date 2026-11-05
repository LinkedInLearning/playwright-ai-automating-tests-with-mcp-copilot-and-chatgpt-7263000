# BuggyBoard Logout End-to-End Test Plan

## Coverage Gap

No current test asserts that Logout ends the authenticated session or prevents
subsequent access to protected content. The board exposes a Logout button; CLI
exploration confirmed that clicking it navigates to `/login`, and directly
opening `/board` afterward also redirects to `/login`.

## Test Scenarios

### 1. Logout

**File:** `tests/logout/logout.spec.ts`

#### 1.1. logs out and returns to login

1. Log in with a configured user and verify that `/board` is displayed.
2. Click Logout.
   - expect: The app navigates to `/login`.
   - expect: The login form is visible and the board is not displayed.

#### 1.2. blocks protected-page access after logout

1. Log in, click Logout, then navigate directly to `/board`.
   - expect: The app redirects to `/login` and does not display board content.
2. Reload the protected URL.
   - expect: The user remains logged out and is still redirected to `/login`.

#### 1.3. browser back does not restore an authenticated view

1. Log in and navigate to the board, then click Logout.
2. Use the browser Back control.
   - expect: No protected board content is restored.
   - expect: If navigation reaches a protected route, it redirects to `/login`.

## Test Data and Isolation

- Log in through the UI using a configured user.
- Run each scenario in a fresh browser context so prior authentication cannot
  affect its result.
