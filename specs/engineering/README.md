# Engineering specs

This folder holds **technical context**: how we build and run the app, and what conventions we follow. Use these when implementing features, adding dependencies, or making architecture decisions. The AI uses them to keep the codebase consistent.

- **tech-stack.md** – Stack (Node, TypeScript, React, Tailwind, Express, SQLite), database location, and constraints (e.g. no tests during development).
- **coding-standards.md** – Style and architecture: simple and direct, resolve errors/lint, DDD, business logic in the service layer.
- **development-process.md** – How we work: spec-first, one feature at a time, pause for review, progress in PROGRESS.md.
- **api-conventions.md** – Backend API routes must use the `/api` path prefix.
- **pipelines.md** – CI/CD pipeline requirements for this repository, including GitHub Actions workflow naming, triggers, caching, and Playwright report artifacts.
- **gherkin-standards.md** – How to write Gherkin scenarios in feature specs (BDD, Given/When/Then, one behavior per scenario, Cucumber syntax).
- **test-automation-patterns.md** – Test automation standards: Page Object Model (POM), page object file structure (`tests/pages/`), locator best practices, and test patterns (Arrange-Act-Assert). **All new and refactored Playwright tests must use page objects.**

You can add more engineering docs here (e.g. folder structure, deployment, security) as needed.
