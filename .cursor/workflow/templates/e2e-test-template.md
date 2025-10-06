# End-to-End Test Template

## Overview
This template provides a standardized structure for creating end-to-end tests in the Diet Game application using Playwright.

## Template Usage
Replace the following placeholders:
- `{{FEATURE_NAME}}` - Name of the feature being tested (e.g., `User Registration`, `Task Management`)
- `{{PAGE_NAME}}` - Name of the page being tested
- `{{USER_TYPE}}` - Type of user (e.g., `authenticated user`, `admin`, `guest`)
- `{{WORKFLOW_NAME}}` - Name of the user workflow

## E2E Test Structure

```typescript
// src/test/e2e/{{FEATURE_NAME}}.test.ts

import { test, expect, Page, BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { {{PAGE_NAME}}Page } from '../pages/{{PAGE_NAME}}Page';
import { DashboardPage } from '../pages/DashboardPage';
import { testData } from '../fixtures/testData';
import { TestUser } from '../helpers/TestUser';

// ============================================================================
// TEST SETUP
// ============================================================================

test.describe('{{FEATURE_NAME}} E2E Tests', () => {
  let context: BrowserContext;
  let page: Page;
  let loginPage: LoginPage;
  let {{page_name}}Page: {{PAGE_NAME}}Page;
  let dashboardPage: DashboardPage;
  let testUser: TestUser;

  test.beforeAll(async ({ browser }) => {
    // Create a new browser context for the test suite
    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      locale: 'en-US',
      timezoneId: 'America/New_York'
    });
    
    // Create test user
    testUser = await TestUser.create({
      email: `test-${Date.now()}@example.com`,
      password: 'TestPassword123!',
      name: 'Test User'
    });
  });

  test.beforeEach(async () => {
    // Create a new page for each test
    page = await context.newPage();
    
    // Initialize page objects
    loginPage = new LoginPage(page);
    {{page_name}}Page = new {{PAGE_NAME}}Page(page);
    dashboardPage = new DashboardPage(page);

    // Set up request interception for API calls
    await page.route('**/api/**', async (route) => {
      const request = route.request();
      console.log(`API Request: ${request.method()} ${request.url()}`);
      await route.continue();
    });

    // Set up console logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error(`Console Error: ${msg.text()}`);
      }
    });

    // Set up network error handling
    page.on('response', response => {
      if (response.status() >= 400) {
        console.error(`HTTP Error: ${response.status()} ${response.url()}`);
      }
    });
  });

  test.afterEach(async () => {
    // Take screenshot on test failure
    if (test.info().status === 'failed') {
      await page.screenshot({ 
        path: `test-results/screenshots/${test.info().title}-${Date.now()}.png`,
        fullPage: true 
      });
    }
    
    await page.close();
  });

  test.afterAll(async () => {
    // Clean up test user
    await testUser.delete();
    await context.close();
  });

  // ============================================================================
  // HAPPY PATH TESTS
  // ============================================================================

  test('{{USER_TYPE}} should be able to complete {{WORKFLOW_NAME}} workflow', async () => {
    // Step 1: Login
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await expect(dashboardPage.page).toHaveURL(/.*dashboard/);
    await expect(dashboardPage.welcomeMessage).toContainText(testUser.name);

    // Step 2: Navigate to {{PAGE_NAME}}
    await dashboardPage.navigateTo{{PAGE_NAME}}();
    await expect({{page_name}}Page.page).toHaveURL(/.*{{page_name}}/);
    await expect({{page_name}}Page.pageTitle).toBeVisible();

    // Step 3: Perform main action
    await {{page_name}}Page.performMainAction(testData.validInput);
    
    // Step 4: Verify success
    await expect({{page_name}}Page.successMessage).toBeVisible();
    await expect({{page_name}}Page.successMessage).toContainText('successfully');

    // Step 5: Verify data persistence
    await {{page_name}}Page.refresh();
    await expect({{page_name}}Page.dataTable).toContainText(testData.validInput.name);
  });

  test('{{USER_TYPE}} should be able to view {{FEATURE_NAME}} data', async () => {
    // Setup: Login and navigate to page
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await dashboardPage.navigateTo{{PAGE_NAME}}();

    // Verify page loads correctly
    await expect({{page_name}}Page.pageTitle).toBeVisible();
    await expect({{page_name}}Page.dataTable).toBeVisible();
    
    // Verify data is displayed
    await expect({{page_name}}Page.dataTable).toContainText('Sample Data');
    
    // Verify pagination if applicable
    if (await {{page_name}}Page.pagination.isVisible()) {
      await expect({{page_name}}Page.pagination).toBeVisible();
    }
  });

  test('{{USER_TYPE}} should be able to search and filter {{FEATURE_NAME}} data', async () => {
    // Setup: Login and navigate to page
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await dashboardPage.navigateTo{{PAGE_NAME}}();

    // Test search functionality
    await {{page_name}}Page.searchInput.fill('test search');
    await {{page_name}}Page.searchButton.click();
    
    await expect({{page_name}}Page.dataTable).toContainText('test search');
    
    // Test filter functionality
    await {{page_name}}Page.filterDropdown.selectOption('active');
    await expect({{page_name}}Page.dataTable).toContainText('active');
    
    // Clear filters
    await {{page_name}}Page.clearFiltersButton.click();
    await expect({{page_name}}Page.dataTable).toBeVisible();
  });

  // ============================================================================
  // FORM VALIDATION TESTS
  // ============================================================================

  test('should show validation errors for invalid form input', async () => {
    // Setup: Login and navigate to page
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await dashboardPage.navigateTo{{PAGE_NAME}}();

    // Test empty form submission
    await {{page_name}}Page.submitButton.click();
    
    await expect({{page_name}}Page.validationErrors).toContainText('required');
    
    // Test invalid email format
    await {{page_name}}Page.emailInput.fill('invalid-email');
    await {{page_name}}Page.submitButton.click();
    
    await expect({{page_name}}Page.validationErrors).toContainText('valid email');
    
    // Test password requirements
    await {{page_name}}Page.passwordInput.fill('123');
    await {{page_name}}Page.submitButton.click();
    
    await expect({{page_name}}Page.validationErrors).toContainText('8 characters');
  });

  test('should clear validation errors when valid input is provided', async () => {
    // Setup: Login and navigate to page
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await dashboardPage.navigateTo{{PAGE_NAME}}();

    // Trigger validation error
    await {{page_name}}Page.submitButton.click();
    await expect({{page_name}}Page.validationErrors).toBeVisible();
    
    // Provide valid input
    await {{page_name}}Page.nameInput.fill('Valid Name');
    await {{page_name}}Page.emailInput.fill('valid@example.com');
    
    // Verify validation errors are cleared
    await expect({{page_name}}Page.validationErrors).not.toBeVisible();
  });

  // ============================================================================
  // ERROR HANDLING TESTS
  // ============================================================================

  test('should handle network errors gracefully', async () => {
    // Setup: Login and navigate to page
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await dashboardPage.navigateTo{{PAGE_NAME}}();

    // Mock network failure
    await page.route('**/api/{{feature_name}}/**', route => route.abort());
    
    // Attempt to perform action
    await {{page_name}}Page.performMainAction(testData.validInput);
    
    // Verify error handling
    await expect({{page_name}}Page.errorMessage).toBeVisible();
    await expect({{page_name}}Page.errorMessage).toContainText('network error');
    
    // Verify retry functionality
    await {{page_name}}Page.retryButton.click();
    await expect({{page_name}}Page.loadingSpinner).toBeVisible();
  });

  test('should handle server errors gracefully', async () => {
    // Setup: Login and navigate to page
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await dashboardPage.navigateTo{{PAGE_NAME}}();

    // Mock server error
    await page.route('**/api/{{feature_name}}/**', route => 
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      })
    );
    
    // Attempt to perform action
    await {{page_name}}Page.performMainAction(testData.validInput);
    
    // Verify error handling
    await expect({{page_name}}Page.errorMessage).toBeVisible();
    await expect({{page_name}}Page.errorMessage).toContainText('server error');
  });

  // ============================================================================
  // ACCESSIBILITY TESTS
  // ============================================================================

  test('should be accessible with keyboard navigation', async () => {
    // Setup: Login and navigate to page
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await dashboardPage.navigateTo{{PAGE_NAME}}();

    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await expect({{page_name}}Page.firstFocusableElement).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect({{page_name}}Page.secondFocusableElement).toBeFocused();
    
    // Test form submission with keyboard
    await {{page_name}}Page.nameInput.focus();
    await page.keyboard.type('Test Name');
    await page.keyboard.press('Tab');
    await page.keyboard.type('test@example.com');
    await page.keyboard.press('Enter');
    
    await expect({{page_name}}Page.successMessage).toBeVisible();
  });

  test('should have proper ARIA labels and roles', async () => {
    // Setup: Login and navigate to page
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await dashboardPage.navigateTo{{PAGE_NAME}}();

    // Check ARIA labels
    await expect({{page_name}}Page.nameInput).toHaveAttribute('aria-label');
    await expect({{page_name}}Page.submitButton).toHaveAttribute('aria-label');
    
    // Check ARIA roles
    await expect({{page_name}}Page.dataTable).toHaveAttribute('role', 'table');
    await expect({{page_name}}Page.navigation).toHaveAttribute('role', 'navigation');
    
    // Check ARIA states
    await expect({{page_name}}Page.loadingSpinner).toHaveAttribute('aria-live', 'polite');
  });

  // ============================================================================
  // RESPONSIVE DESIGN TESTS
  // ============================================================================

  test('should work correctly on mobile devices', async () => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Setup: Login and navigate to page
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await dashboardPage.navigateTo{{PAGE_NAME}}();

    // Verify mobile layout
    await expect({{page_name}}Page.mobileMenuButton).toBeVisible();
    await expect({{page_name}}Page.pageTitle).toBeVisible();
    
    // Test mobile interactions
    await {{page_name}}Page.mobileMenuButton.click();
    await expect({{page_name}}Page.mobileMenu).toBeVisible();
    
    // Test form on mobile
    await {{page_name}}Page.nameInput.fill('Mobile Test');
    await {{page_name}}Page.submitButton.click();
    await expect({{page_name}}Page.successMessage).toBeVisible();
  });

  test('should work correctly on tablet devices', async () => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Setup: Login and navigate to page
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await dashboardPage.navigateTo{{PAGE_NAME}}();

    // Verify tablet layout
    await expect({{page_name}}Page.pageTitle).toBeVisible();
    await expect({{page_name}}Page.sidebar).toBeVisible();
    
    // Test tablet interactions
    await {{page_name}}Page.performMainAction(testData.validInput);
    await expect({{page_name}}Page.successMessage).toBeVisible();
  });

  // ============================================================================
  // PERFORMANCE TESTS
  // ============================================================================

  test('should load page within acceptable time', async () => {
    const startTime = Date.now();
    
    // Setup: Login and navigate to page
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await dashboardPage.navigateTo{{PAGE_NAME}}();

    // Wait for page to be fully loaded
    await expect({{page_name}}Page.pageTitle).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    
    // Verify page loads within acceptable time (adjust based on requirements)
    expect(loadTime).toBeLessThan(3000); // 3 seconds
  });

  test('should handle large datasets efficiently', async () => {
    // Setup: Login and navigate to page
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await dashboardPage.navigateTo{{PAGE_NAME}}();

    const startTime = Date.now();
    
    // Load large dataset
    await {{page_name}}Page.loadLargeDataset();
    await expect({{page_name}}Page.dataTable).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    
    // Verify large dataset loads within acceptable time
    expect(loadTime).toBeLessThan(5000); // 5 seconds
    
    // Verify pagination works
    await expect({{page_name}}Page.pagination).toBeVisible();
  });

  // ============================================================================
  // SECURITY TESTS
  // ============================================================================

  test('should prevent unauthorized access', async () => {
    // Try to access protected page without login
    await {{page_name}}Page.goto();
    
    // Should redirect to login page
    await expect(page).toHaveURL(/.*login/);
    await expect(loginPage.loginForm).toBeVisible();
  });

  test('should handle session expiration gracefully', async () => {
    // Setup: Login and navigate to page
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await dashboardPage.navigateTo{{PAGE_NAME}}();

    // Mock session expiration
    await page.evaluate(() => {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
    });
    
    // Attempt to perform action
    await {{page_name}}Page.performMainAction(testData.validInput);
    
    // Should redirect to login page
    await expect(page).toHaveURL(/.*login/);
  });

  // ============================================================================
  // CROSS-BROWSER TESTS
  // ============================================================================

  test('should work consistently across different browsers', async () => {
    // This test will run on all configured browsers
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await dashboardPage.navigateTo{{PAGE_NAME}}();

    // Verify core functionality works
    await expect({{page_name}}Page.pageTitle).toBeVisible();
    await {{page_name}}Page.performMainAction(testData.validInput);
    await expect({{page_name}}Page.successMessage).toBeVisible();
  });
});
```

## Page Object Model

```typescript
// src/test/pages/{{PAGE_NAME}}Page.ts

import { Page, Locator, expect } from '@playwright/test';

export class {{PAGE_NAME}}Page {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly dataTable: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly filterDropdown: Locator;
  readonly clearFiltersButton: Locator;
  readonly pagination: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly validationErrors: Locator;
  readonly loadingSpinner: Locator;
  readonly retryButton: Locator;
  readonly mobileMenuButton: Locator;
  readonly mobileMenu: Locator;
  readonly sidebar: Locator;
  readonly firstFocusableElement: Locator;
  readonly secondFocusableElement: Locator;
  readonly navigation: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Page elements
    this.pageTitle = page.locator('h1');
    this.nameInput = page.locator('[data-testid="name-input"]');
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.submitButton = page.locator('[data-testid="submit-button"]');
    this.dataTable = page.locator('[data-testid="data-table"]');
    this.searchInput = page.locator('[data-testid="search-input"]');
    this.searchButton = page.locator('[data-testid="search-button"]');
    this.filterDropdown = page.locator('[data-testid="filter-dropdown"]');
    this.clearFiltersButton = page.locator('[data-testid="clear-filters-button"]');
    this.pagination = page.locator('[data-testid="pagination"]');
    this.successMessage = page.locator('[data-testid="success-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.validationErrors = page.locator('[data-testid="validation-errors"]');
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
    this.retryButton = page.locator('[data-testid="retry-button"]');
    this.mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
    this.mobileMenu = page.locator('[data-testid="mobile-menu"]');
    this.sidebar = page.locator('[data-testid="sidebar"]');
    this.firstFocusableElement = page.locator('[data-testid="first-focusable"]');
    this.secondFocusableElement = page.locator('[data-testid="second-focusable"]');
    this.navigation = page.locator('[data-testid="navigation"]');
  }

  async goto() {
    await this.page.goto('/{{page_name}}');
  }

  async performMainAction(data: any) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.submitButton.click();
  }

  async loadLargeDataset() {
    await this.page.goto('/{{page_name}}?size=large');
    await this.dataTable.waitFor();
  }

  async refresh() {
    await this.page.reload();
    await this.dataTable.waitFor();
  }
}
```

## Test Data and Fixtures

```typescript
// src/test/fixtures/testData.ts

export const testData = {
  validInput: {
    name: 'Test User',
    email: 'test@example.com',
    password: 'TestPassword123!'
  },
  invalidInput: {
    name: '',
    email: 'invalid-email',
    password: '123'
  },
  largeDataset: {
    count: 1000,
    searchTerm: 'test'
  }
};
```

## Test Helpers

```typescript
// src/test/helpers/TestUser.ts

export class TestUser {
  email: string;
  password: string;
  name: string;
  id?: string;

  constructor(data: { email: string; password: string; name: string }) {
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
  }

  static async create(data: { email: string; password: string; name: string }): Promise<TestUser> {
    // Create user via API
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const userData = await response.json();
    const user = new TestUser(data);
    user.id = userData.id;
    return user;
  }

  async delete(): Promise<void> {
    if (this.id) {
      await fetch(`/api/users/${this.id}`, {
        method: 'DELETE'
      });
    }
  }
}
```

## Playwright Configuration

```typescript
// playwright.config.ts

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/test/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  }
});
```

## Best Practices

1. **Page Object Model**: Use page objects to encapsulate page interactions
2. **Test Isolation**: Each test should be independent and not affect others
3. **Data Management**: Use test fixtures and helpers for consistent test data
4. **Error Handling**: Test both success and failure scenarios
5. **Accessibility**: Include accessibility tests in your E2E suite
6. **Performance**: Monitor page load times and performance metrics
7. **Cross-Browser**: Test on multiple browsers and devices
8. **Screenshots**: Take screenshots on test failures for debugging
9. **Parallel Execution**: Run tests in parallel for faster execution
10. **CI/CD Integration**: Integrate E2E tests into your deployment pipeline

## Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific E2E test file
npm run test:e2e {{FEATURE_NAME}}.test.ts

# Run E2E tests in headed mode (with browser UI)
npm run test:e2e:headed

# Run E2E tests on specific browser
npm run test:e2e -- --project=chromium

# Run E2E tests with debug mode
npm run test:e2e:debug
```

## Related Documentation

- [Integration Test Template](./integration-test-template.md)
- [Unit Test Template](./unit-test-template.md)
- [Testing Guide](../TESTING_GUIDE.md)
- [Playwright Documentation](https://playwright.dev/)
