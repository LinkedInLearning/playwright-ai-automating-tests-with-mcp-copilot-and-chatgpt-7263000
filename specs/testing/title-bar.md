# BuggyBoard Title Bar End-to-End Test Plan

## Coverage Gap

Current BuggyBoard tests do not assert the board title bar. Playwright CLI
exploration showed a banner containing the BuggyBoard image and heading, plus
New Bug, search, and Logout controls. The title-bar feature acceptance criteria
require the brand image, title, and right-justified Logout control.

## Test Scenarios

### 1. Board Title Bar

**File:** `tests/title-bar/title-bar.spec.ts`

#### 1.1. displays BuggyBoard branding and logout

1. Authenticate and navigate to `/board`.
   - expect: A banner is visible.
   - expect: The BuggyBoard logo and “BuggyBoard” heading are visible.
   - expect: Logout is visible in the banner.
2. Inspect the banner layout at the standard desktop viewport.
   - expect: The logo and title are grouped at the left and Logout is
     right-justified.

#### 1.2. exposes board actions in the title bar

1. Inspect the authenticated board banner.
   - expect: New Bug and the title-search control are visible alongside
     Logout.
   - expect: The title-search control appears before New Bug in the banner.

## Test Data and Isolation

- Authenticate through the login page with a configured user.
- Keep Logout's session-ending behavior in `specs/testing/logout.md`; this
  plan checks its presence and placement only.
