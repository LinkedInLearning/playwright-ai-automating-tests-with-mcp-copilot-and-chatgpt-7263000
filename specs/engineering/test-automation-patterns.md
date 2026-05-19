# Test Automation Patterns

This document establishes **core patterns** for writing maintainable, reliable Playwright tests for BuggyBoard. All new and refactored tests must follow these conventions.

## Page Object Model (POM)

We use the **Page Object Model** pattern to encapsulate page structure and behavior, making tests readable, maintainable, and robust.

**Guiding principle:** Tests should express *what* users do (business logic), not *how* the browser does it. Page objects handle the *how*.

### Why Page Objects?

- **Decouples tests from UI** – When the UI changes, update the page object, not dozens of tests
- **Improves readability** – Tests read like user stories, not raw browser calls
- **Reduces duplication** – Shared element locators and interactions live in one place
- **Easier debugging** – Failed assertions point to page objects, not scattered test code
- **Faster refactoring** – Rename a method once instead of updating all tests

### Architecture

```
tests/
  pages/               ← Page object classes
    LoginPage.ts
    BoardPage.ts
    CreateBugModal.ts
    EditBugModal.ts
    TitleBar.ts
  create-bug/
    open-create-bug-modal.spec.ts
    create-bug-success.spec.ts
  delete-bug/
    should-delete.spec.ts
  search-bug/
    search-atomic.spec.ts
```

### File Structure: One Page Object Per File

**Rule:** Each page object class occupies its own file under `tests/pages/`.

File naming: `<PageName>.ts` (e.g., `LoginPage.ts`, `CreateBugModal.ts`)

```typescript
// tests/pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getErrorMessage(): Promise<string> {
    return this.errorMessage.textContent() || '';
  }
}
```

### Page Object Class Anatomy

1. **Constructor** – Accepts the Playwright `Page` object and initializes all locators
2. **Locators** – Store element references as class properties (do not hardcode in methods)
3. **Navigation** – Methods to navigate to the page (`goto()`)
4. **User actions** – Methods that simulate user interactions (`login()`, `fillForm()`, `submit()`)
5. **Queries** – Methods that read/verify page state (`getErrorMessage()`, `isButtonDisabled()`)

### Locator Best Practices

Use **semantic locators** in order of preference:

1. **Role-based** – `page.getByRole('button', { name: 'Submit' })`
2. **Label** – `page.getByLabel('Username')`
3. **Placeholder** – `page.getByPlaceholder('Enter email')`
4. **Text** – `page.getByText('Welcome')`
5. **Test ID** – `page.getByTestId('submit-button')`
6. **CSS/XPath** – Last resort only

**Why?** Role-based and label-based locators are most resilient to layout changes and accessible.

### Test Pattern: Arrange-Act-Assert

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('user can log in with valid credentials', async ({ page }) => {
  // Arrange
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  // Act
  await loginPage.login('alice', 'password123');

  // Assert
  await expect(page).toHaveURL('/board');
});
```

Each test is **atomic** – it focuses on one behavior and does not depend on state from other tests.

### Common Page Object Methods

| Pattern | Purpose | Example |
|---------|---------|---------|
| `async goto()` | Navigate to page | `await page.goto('/login')` |
| `async <action>()` | Perform user action | `await page.login(user, pass)` |
| `get<Value>()` | Query/read state | `await page.getErrorMessage()` |
| `is<State>()` | Check condition | `await page.isButtonDisabled()` |
| `has<Element>()` | Check visibility | `await page.hasSuccessMessage()` |

### Combining Page Objects (Composite Pages)

When a workflow spans multiple pages, use multiple page objects in the test:

```typescript
test('user creates a bug and views it on the board', async ({ page }) => {
  // Arrange
  const boardPage = new BoardPage(page);
  const modalPage = new CreateBugModal(page);
  
  // Act
  await boardPage.goto();
  await boardPage.clickCreateButton();
  await modalPage.fillBugForm({
    title: 'Login button broken',
    severity: 'high'
  });
  await modalPage.clickSubmit();

  // Assert
  await expect(boardPage.getBugRow('Login button broken')).toBeVisible();
});
```

### Modal and Overlay Pages

Modals and overlays inherit the same pattern but represent a contained UI context:

```typescript
// tests/pages/CreateBugModal.ts
export class CreateBugModal {
  readonly page: Page;
  readonly titleInput: Locator;
  readonly submitButton: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleInput = page.getByLabel('Title');
    this.submitButton = page.getByRole('button', { name: 'Create' });
    this.closeButton = page.getByRole('button', { name: 'Cancel' });
  }

  async fillBugForm(data: { title: string; severity: string }) {
    await this.titleInput.fill(data.title);
    await page.getByLabel('Severity').selectOption(data.severity);
  }

  async clickSubmit() {
    await this.submitButton.click();
    await this.page.waitForSelector('[role="dialog"]', { state: 'hidden' });
  }
}
```

### Avoiding Anti-Patterns

| ❌ Anti-Pattern | ✅ Correct |
|---|---|
| Raw page calls in tests | Encapsulate in page objects |
| Hardcoded locators in tests | Define locators in page object |
| Methods that do too much | Split into single-responsibility methods |
| Ignoring waits/assertions | Use explicit waits; assert after actions |
| Testing implementation details | Test user-facing behavior only |

### References

- [Playwright Page Object Model](https://playwright.dev/docs/pom)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright Locators](https://playwright.dev/docs/locators)

---

**Last updated:** May 2026  
**Maintained by:** Engineering team
