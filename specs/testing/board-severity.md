# Board Severity End-to-End Test Plan

## Overview

This suite validates severity styling on the BuggyBoard board. It covers color-coded severity badges, design token usage, and visual distinction between HIGH, MID, and LOW severities.

## Suite: Board Severity

### Seed
- `tests/seed.spec.ts`

## Scenarios

#### 1. Severity on the board is color-coded
- Sign in as a valid user.
- Ensure there are bugs with HIGH, MID, and LOW severities.
- Navigate to `/board`.
- Verify each severity cell uses the expected severity styling.

#### 2. HIGH severity uses the design system color
- Ensure a bug with HIGH severity exists.
- Navigate to `/board`.
- Verify the HIGH severity badge or text uses the strong terracotta color.
- Verify the styling is consistent with the CSS custom property for high severity.

#### 3. Severity colors are visually distinct
- Ensure at least two different severities are present.
- Navigate to `/board`.
- Verify HIGH, MID, and LOW badges are visually distinct.
- Verify HIGH appears more prominent than MID and LOW.

#### 4. Severity styling uses design tokens
- Navigate to `/board`.
- Verify severity colors are available as CSS custom properties.
- Verify the board uses those tokens so severity styling remains consistent across the app.

## Notes
- Tests may verify color values by inspecting computed styles or the rendered HTML classes.
- If the app uses severity badges, assert both text and background styling where possible.
