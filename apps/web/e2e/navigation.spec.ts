import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between main pages via desktop header', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/OpenForge/i);

    // Click Repositories link
    await page.click('nav[aria-label="Main Navigation"] >> text=Repositories');
    await expect(page).toHaveURL(/\/repositories/);

    // Click Issues link
    await page.click('nav[aria-label="Main Navigation"] >> text=Issues');
    await expect(page).toHaveURL(/\/issues/);

    // Click Recommendations link
    await page.click('nav[aria-label="Main Navigation"] >> text=Recommendations');
    await expect(page).toHaveURL(/\/recommendations/);

    // Click Search link
    await page.click('nav[aria-label="Main Navigation"] >> text=Search');
    await expect(page).toHaveURL(/\/search/);

    // Click About link
    await page.click('nav[aria-label="Main Navigation"] >> text=About');
    await expect(page).toHaveURL(/\/about/);
  });

  test('should open mobile navigation drawer on small viewports', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const toggleButton = page.getByRole('button', { name: /Toggle Navigation Menu/i });
    await expect(toggleButton).toBeVisible();

    await toggleButton.click();
    const mobileNav = page.locator('nav[aria-label="Mobile Navigation"]');
    await expect(mobileNav).toBeVisible();

    await mobileNav.getByText('Repositories').click();
    await expect(page).toHaveURL(/\/repositories/);
  });
});
