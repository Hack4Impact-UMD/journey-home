import { test, expect } from '@playwright/test';

test.describe('Journey Home App', () => {

  test('should load without errors', async ({ page }) => {
    // Listen for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check that there are no console errors
    expect(errors).toHaveLength(0);
  });
});
