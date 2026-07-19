# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shortener.spec.ts >> URL Shortener >> should create a short URL and redirect properly
- Location: e2e\shortener.spec.ts:4:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.waitFor: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('text=kwiktoolbox.com/s/') to be visible

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - complementary [ref=e3]:
      - link "QuickToolbox 25 Free Online Tools" [ref=e5] [cursor=pointer]:
        - /url: /
        - img [ref=e7]
        - generic [ref=e9]:
          - generic [ref=e10]: QuickToolbox
          - text: 25 Free Online Tools
      - generic [ref=e12]:
        - img
        - textbox "Search tools..." [ref=e13]: https://example.com
      - navigation [ref=e14]:
        - paragraph [ref=e16]: No tools found
      - generic [ref=e19]:
        - generic [ref=e20]:
          - img [ref=e21]
          - paragraph [ref=e24]: Go Premium
        - paragraph [ref=e25]: Remove ads, unlock bulk tools & analytics
        - link "Upgrade Now" [ref=e26] [cursor=pointer]:
          - /url: /premium
          - text: Upgrade Now
          - img [ref=e27]
    - main [ref=e31]:
      - generic [ref=e32]:
        - link "QuickToolbox" [ref=e33] [cursor=pointer]:
          - /url: /
          - img [ref=e35]
          - generic [ref=e37]: QuickToolbox
        - generic [ref=e39]:
          - img [ref=e41]
          - generic [ref=e44]:
            - heading "URL Shortener" [level=1] [ref=e45]
            - paragraph [ref=e46]: Paste a long URL and get a clean, shareable short link instantly.
        - generic [ref=e47]:
          - link "GitHub" [ref=e48] [cursor=pointer]:
            - /url: https://github.com
            - img [ref=e49]
            - generic [ref=e52]: GitHub
          - link "Sign In" [ref=e54] [cursor=pointer]:
            - /url: /login
            - img [ref=e55]
            - text: Sign In
      - paragraph [ref=e59]:
        - text: Support us and remove ads by
        - link "Upgrading to PRO" [ref=e60] [cursor=pointer]:
          - /url: /#pricing
      - generic [ref=e62]:
        - generic [ref=e64]:
          - img [ref=e66]
          - generic [ref=e69]:
            - heading "URL Shortener" [level=2] [ref=e70]
            - paragraph [ref=e71]: Paste a long URL and get a clean, shareable short link instantly.
        - generic [ref=e75]:
          - generic [ref=e76]: Enter a Long URL
          - generic [ref=e77]:
            - textbox "https://example.com/very/long/url/that/needs/shortening" [ref=e78]
            - button [active] [ref=e79] [cursor=pointer]:
              - img [ref=e80]
          - paragraph [ref=e83]: Please enter a URL
        - generic [ref=e84]:
          - generic [ref=e85]:
            - img [ref=e87]
            - generic [ref=e89]: QuickToolbox
          - paragraph [ref=e90]: Free online tools. No signup. No tracking. 100% private.
          - paragraph [ref=e91]: © 2025 QuickToolbox. All rights reserved.
  - alert [ref=e92]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('URL Shortener', () => {
  4  |   test('should create a short URL and redirect properly', async ({ page }) => {
  5  |     // Navigate to URL shortener tool
  6  |     await page.goto('/tools/url-shortener');
  7  |     
  8  |     // Fill in the URL
  9  |     await page.fill('input[type="text"]', 'https://example.com');
  10 |     await page.click('button.qt-btn');
  11 |     
  12 |     // Wait for the short URL to be generated
  13 |     const shortUrlElement = page.locator('text=kwiktoolbox.com/s/');
> 14 |     await shortUrlElement.waitFor();
     |                           ^ Error: locator.waitFor: Test timeout of 30000ms exceeded.
  15 |     const shortUrlText = await shortUrlElement.innerText();
  16 |     
  17 |     // Test the redirect (avoid actually navigating to external site in test if possible, or just expect it)
  18 |     const shortCodeMatch = shortUrlText.match(/\/s\/([a-zA-Z0-9_-]+)/);
  19 |     expect(shortCodeMatch).not.toBeNull();
  20 |     const shortCode = shortCodeMatch![1];
  21 |     
  22 |     // Let's directly hit the API endpoint to verify 301
  23 |     const request = await page.request.get(`/s/${shortCode}`, { maxRedirects: 0 });
  24 |     expect(request.status()).toBe(301);
  25 |     expect(request.headers()['location']).toBe('https://example.com');
  26 |   });
  27 | });
  28 | 
```