# BuggyBoard Login End-to-End Test Plan

## Coverage Gap

The current BuggyBoard tests only exercise a successful login as setup for other
flows. `tests/seed.spec.ts` also checks a successful login, but is tagged
`@seed` and excluded by the `npm test` script. No test currently covers login
errors, keyboard submission, protected-route redirects, or session persistence.

Playwright CLI exploration confirmed the Username, Password, and Login controls.
Invalid credentials show the alert “Invalid username or password.” Whitespace
in both fields is trimmed, resulting in “Username cannot be blank.” The login
page snapshot did not expose a logo even though the login feature spec requires
one; the logo assertion below should capture that expectation.

## Test Scenarios

### 1. Login

**File:** `tests/login/login.spec.ts`

#### 1.1. displays the login form

1. Navigate to `/login` while unauthenticated.
   - expect: The BuggyBoard login page is displayed with Username, Password,
     and Login controls.
   - expect: The password input is masked.
   - expect: The BuggyBoard logo is visible above the app title.

#### 1.2. redirects unauthenticated users from protected pages

1. Navigate directly to `/board` without an authenticated session.
   - expect: The browser is redirected to `/login` and no board content is
     visible.

#### 1.3. signs in with valid credentials

1. Enter a configured user's valid username and password and click Login.
   - expect: The app navigates to `/board` and displays the authenticated
     board.

#### 1.4. rejects invalid credentials

1. Submit an unknown username with a non-empty password.
   - expect: The user remains on `/login` and a role=alert displays the generic
     invalid-credentials message.
2. Repeat with a configured username and an incorrect password.
   - expect: The same generic error is displayed without revealing which
     credential was incorrect.

#### 1.5. validates blank credentials

1. Submit a blank username with a non-empty password.
   - expect: Login is rejected and an alert identifies the missing username.
2. Submit a valid username with a blank password.
   - expect: Login is rejected and an alert identifies the missing password.
3. Submit both fields blank.
   - expect: Login is rejected and an alert indicates that credentials are
     missing.
4. Repeat with whitespace-only values.
   - expect: Whitespace is treated as blank and the user remains unauthenticated.

#### 1.6. trims username whitespace

1. Submit a valid username surrounded by leading and trailing spaces with its
   correct password.
   - expect: Login succeeds and the app navigates to `/board`.

#### 1.7. submits with Enter from either field

1. Enter valid credentials and press Enter while focused in Username.
   - expect: The same successful login behavior as clicking Login.
2. Repeat with Enter pressed while focused in Password.
   - expect: The same successful login behavior.

#### 1.8. preserves an authenticated session after reload

1. Log in with valid credentials and reload `/board`.
   - expect: The user remains authenticated and the board is displayed.

#### 1.9. redirects authenticated users away from login

1. While authenticated, navigate to `/login`.
   - expect: The app redirects to `/board`.

## Test Data and Isolation

- Read valid credentials from `users.json`; do not hardcode a password in the
  test.
- Use a fresh browser context for unauthenticated scenarios.
- Assert user-visible errors and routes rather than authentication internals.
