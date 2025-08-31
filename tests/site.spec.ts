import { test, expect } from '@playwright/test';

test.describe('LinkedIn Website', () => {
  test('loads homepage and shows brand', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Done for you LinkedIn Growth/i);
    await expect(page.locator('header .brand span')).toHaveText(/PresencePro by Rankzela/i);
  });

  test('hero CTA goes to Calendly', async ({ page }) => {
    await page.goto('/');
    const cta = page.locator('.hero .cta-row .btn.primary').first();
    await expect(cta).toHaveAttribute('href', 'https://calendly.com/dima-hodonovich22/30min');
  });

  test('pricing card contains first month free', async ({ page }) => {
    await page.goto('/');
    const badge = page.locator('.pricing-card .promo-badge');
    await expect(badge).toContainText(/First month free/i);
  });
});

