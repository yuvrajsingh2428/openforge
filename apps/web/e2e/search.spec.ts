import { test, expect } from '@playwright/test';

test.describe('Search', () => {
  test('should allow user to search for repositories', async ({ page }) => {
    await page.goto('/search');
    
    const searchInput = page.getByPlaceholder(/Search GitHub/i);
    await searchInput.fill('react');
    
    // Results should appear eventually (might take some time due to debounce and network)
    await expect(page.locator('.grid > div').first()).toBeVisible({ timeout: 10000 });
  });
});
