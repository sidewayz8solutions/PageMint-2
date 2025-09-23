import { test, expect } from '@playwright/test';

test.describe('PageMint Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/PageMint/);
    
    // Check main heading - use first h2 element specifically
    await expect(page.locator('h2').first()).toContainText('Launch Your SaaS');
    
    // Check navigation
    await expect(page.locator('nav')).toBeVisible();
    
    // Check footer
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should display all main sections', async ({ page }) => {
    await page.goto('/');
    
    // Check all main sections are present
    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('#showcase')).toBeVisible();
    await expect(page.locator('#features')).toBeVisible();
    await expect(page.locator('#pricing')).toBeVisible();
    await expect(page.locator('#testimonials')).toBeVisible();
    await expect(page.locator('#faq')).toBeVisible();
    await expect(page.locator('#cta')).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');

    // Test navigation to pricing section (use more specific selector)
    await page.click('nav >> text=Pricing');
    await page.waitForTimeout(1000); // Wait for scroll animation
    await expect(page.locator('#pricing')).toBeInViewport();

    // Test navigation to features section
    await page.click('nav >> text=Features');
    await page.waitForTimeout(1000); // Wait for scroll animation
    await expect(page.locator('#features')).toBeInViewport();
  });

  test('should display pricing information', async ({ page }) => {
    await page.goto('/');

    // Check pricing is displayed - use first occurrence
    await expect(page.locator('text=$29').first()).toBeVisible();
    await expect(page.locator('text=$59').first()).toBeVisible();
    
    // Check product names (use more specific selectors)
    await expect(page.locator('#pricing h3:has-text("Starter Pack")')).toBeVisible();
    await expect(page.locator('#pricing h3:has-text("Pro Pack")')).toBeVisible();
  });

  test('should have responsive design', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await expect(page.locator('nav')).toBeVisible();
    
    // Check mobile menu button is visible
    await expect(page.locator('[aria-label="Open menu"]')).toBeVisible();
  });

  test('should load without console errors', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out known non-critical errors
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('404') &&
      !error.includes('net::ERR_')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    await page.goto('/');
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);
    
    // Check viewport meta tag
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);
  });

  test('should handle payment button interactions', async ({ page }) => {
    await page.goto('/');
    
    // Find payment buttons - use first occurrence
    const proPackButton = page.locator('text=Get Pro Pack').first();
    await expect(proPackButton).toBeVisible();
    
    // Note: We don't actually click to avoid triggering real payments
    // In a real test environment, you'd mock the payment service
    await expect(proPackButton).toBeEnabled();
  });
});
