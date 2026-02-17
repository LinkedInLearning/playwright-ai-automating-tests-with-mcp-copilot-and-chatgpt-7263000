# Tech Stack

## Summary

BuggyBoard is a **full-stack Node.js** application written in **TypeScript**.

| Layer    | Choice     | Notes           |
| -------- | ---------- | --------------- |
| Frontend | React      | UI components   |
| Styling  | Tailwind   | CSS framework   |
| Backend  | Express    | API and server  |
| Database | SQLite     | Persistence     |
| Language | TypeScript | Entire codebase |

## Database

- **Single SQLite file** at `backend/data/buggyboard.db`. Created automatically on first backend run.
- No migration mechanism; no separate dev/test/prod databases (example app only).

## Constraints

- **Do not add Playwright (or other) tests during development.** Tests will be introduced as part of the course material later.
