import { test, expect } from '@playwright/test';

test.describe('URL Shortener', () => {
  test('should create a short URL and redirect properly', async ({ page }) => {
    // Navigate to URL shortener tool
    await page.goto('/tools/url-shortener');
    
    // Fill in the URL
    await page.fill('input[type="text"]', 'https://example.com');
    await page.click('button.qt-btn');
    
    // Wait for the short URL to be generated
    const shortUrlElement = page.locator('a[href*="/s/"]');
    await shortUrlElement.waitFor();
    const shortUrlText = await shortUrlElement.innerText();
    
    // Test the redirect (avoid actually navigating to external site in test if possible, or just expect it)
    const shortCodeMatch = shortUrlText.match(/\/s\/([a-zA-Z0-9_-]+)/);
    expect(shortCodeMatch).not.toBeNull();
    const shortCode = shortCodeMatch![1];
    
    // Let's directly hit the API endpoint to verify 301
    const request = await page.request.get(`/s/${shortCode}`, { maxRedirects: 0 });
    expect(request.status()).toBe(301);
    expect(request.headers()['location']).toBe('https://example.com');
  });
});
