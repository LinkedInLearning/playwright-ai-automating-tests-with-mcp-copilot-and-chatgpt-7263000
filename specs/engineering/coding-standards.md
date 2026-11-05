# Coding Standards

- **Be simple and direct** rather than complicated and clever.
- **Resolve all errors and linter warnings** before considering a task complete.
- **Keep packages up to date** within the constraints of the stack.
- **Follow Domain Driven Design (DDD) principles** where applicable (bounded contexts, clear domain language, see `specs/product/glossary.md`).
- **Keep business logic in the service layer** and out of the frontend as much as possible; the frontend should orchestrate and display, not implement core rules.
- **Follow `test-automation-patterns.md`** when adding or refactoring Playwright tests. New and refactored tests must use page objects from `tests/page/` rather than long raw `page` call chains.
