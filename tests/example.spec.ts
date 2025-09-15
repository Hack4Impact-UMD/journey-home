import { test, expect } from '@playwright/test';

test.describe('Journey Home App', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page title is correct
    await expect(page).toHaveTitle(/Create Next App/);
    
    // Check if the Next.js logo is visible
    await expect(page.locator('img[alt="Next.js logo"]')).toBeVisible();
    
    // Check if the main content is present
    await expect(page.locator('main')).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Check if the footer links are present and clickable
    const learnLink = page.locator('a[href*="nextjs.org/learn"]');
    await expect(learnLink).toBeVisible();
    
    const examplesLink = page.locator('a[href*="vercel.com/templates"]');
    await expect(examplesLink).toBeVisible();
    
    const docsLink = page.locator('a[href*="nextjs.org/docs"]');
    await expect(docsLink).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check if the layout adapts to mobile
    await expect(page.locator('main')).toBeVisible();
    
    // Check if the mobile layout is applied
    const mainElement = page.locator('main');
    await expect(mainElement).toHaveClass(/flex-col/);
  });

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
