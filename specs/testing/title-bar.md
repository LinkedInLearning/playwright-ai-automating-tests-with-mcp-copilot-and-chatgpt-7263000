# Title Bar End-to-End Test Plan

## Overview

This suite validates the BuggyBoard title bar on the board page. It covers layout, branding, and presence of key header elements used by authenticated users.

## Suite: Title Bar

### Seed
- `tests/seed.spec.ts`

## Scenarios

#### 1. Board page displays the title bar
- Sign in as a valid user.
- Navigate to the board page.
- Verify the title bar is displayed across the top of the page.

#### 2. Title bar shows the BuggyBoard logo
- Verify the board page header includes the logo asset.
- Verify the logo is visible in a rounded box.

#### 3. Title bar shows the app title text
- Verify the title bar contains the text `BuggyBoard` next to the logo.

#### 4. Title bar shows the logout button
- Verify the title bar includes a logout button.
- Verify the logout button is right-justified in the header.

#### 5. Title bar styling follows the app theme
- Verify the title bar renders using the application theme styling.
- Verify the header background and text contrast matches the design system.

## Notes
- Title-bar tests are focused on visibility and layout; interaction tests are covered in logout tests.
