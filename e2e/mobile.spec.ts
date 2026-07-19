import { test, expect, devices } from '@playwright/test';

test.describe('Mobile Rendering', () => {

  test('should render properly on Mobile Chrome', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title).toContain('KwikToolbox');
    
    // Ensure content is visible and no blank white screen
    const heroText = page.locator('h1').first();
    await expect(heroText).toBeVisible();
    
    // The width should be constrained (no overflow breaking layout)
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const windowWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(windowWidth);
  });

  test('should not blank out when simulating Desktop view on Mobile', async ({ page }) => {
    // Toggling desktop view in mobile Chrome usually forces a 980px viewport on a small screen
    // We emulate this by setting a fixed large viewport on a mobile device profile
    await page.setViewportSize({ width: 980, height: 1080 });
    
    await page.goto('/');
    const heroText = page.locator('h1').first();
    await expect(heroText).toBeVisible();
    
    // Validate it's not rendering a blank page due to overflow clipping issues
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeGreaterThan(0);
  });
});

test.describe('Mobile Safari', () => {

  test('should render properly on iOS', async ({ page }) => {
    await page.goto('/');
    const heroText = page.locator('h1').first();
    await expect(heroText).toBeVisible();
  });
});
