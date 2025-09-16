# Testing Guide

This project uses Playwright for end-to-end testing with a comprehensive CI/CD pipeline.

## Test Setup

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
# Install dependencies (including Playwright)
npm install

# Install Playwright browsers
npx playwright install --with-deps
```

## Running Tests

### Local Development

```bash
# Run all tests
npm test

# Run tests with UI mode (interactive)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# View test report
npm run test:report
```

### Test Configuration

The Playwright configuration is in `playwright.config.ts` and includes:
- Multiple browser support (Chromium, Firefox, WebKit)
- Mobile device testing
- Screenshot and video recording on failures
- HTML and JSON reporting
- Automatic dev server startup

### Writing Tests

Tests are located in the `tests/` directory and follow this structure:

```typescript
import { test, expect } from '@playwright/test';

test('test description', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Expected Title/);
});
```

### Test Examples

Current test suite includes:
- Homepage loading verification
- Navigation link functionality
- Mobile responsiveness
- Error-free page loading

## CI/CD Pipeline

### GitHub Actions Workflows

1. **Main CI Pipeline** (`.github/workflows/ci.yml`)
   - Runs on PR and push to main/develop
   - Linting and build verification
   - Playwright test execution
   - Automatic deployment to Firebase (main branch only)

2. **Playwright Tests** (`.github/workflows/playwright.yml`)
   - Matrix testing across browsers
   - Mobile device testing
   - Separate test report generation

### Pipeline Stages

1. **Lint and Build**: Code quality and build verification
2. **Test**: End-to-end testing with Playwright
3. **Deploy**: Automatic deployment to Firebase Hosting (main branch)

### Required Secrets

For deployment to work, add these secrets to your GitHub repository:
- `FIREBASE_SERVICE_ACCOUNT`: Firebase service account JSON
- `FIREBASE_PROJECT_ID`: Your Firebase project ID

## Test Reports

Test reports are automatically generated and uploaded as artifacts:
- HTML reports for visual inspection
- JSON results for programmatic analysis
- Screenshots and videos for failed tests

## Best Practices

1. **Test Organization**: Group related tests using `test.describe()`
2. **Page Object Model**: Consider using page objects for complex interactions
3. **Test Data**: Use test-specific data and cleanup after tests
4. **Assertions**: Use specific assertions (`toBeVisible()`, `toHaveText()`, etc.)
5. **Wait Strategies**: Use proper waiting for elements and network requests

## Debugging Tests

### Local Debugging
```bash
# Run specific test in debug mode
npx playwright test tests/example.spec.ts --debug

# Run with browser dev tools
npx playwright test --headed
```

### CI Debugging
- Check GitHub Actions logs for detailed error information
- Download test artifacts (reports, screenshots, videos)
- Review test results JSON for programmatic analysis

## Continuous Integration

The CI pipeline ensures:
- Code quality through linting
- Build success verification
- Comprehensive test coverage
- Automatic deployment of working code

All tests must pass before code can be merged to the main branch.
