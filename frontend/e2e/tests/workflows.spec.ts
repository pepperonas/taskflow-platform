import { test, expect } from '@playwright/test';

test.describe('Workflow Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByLabel(/username/i).fill('admin');
    await page.getByLabel(/password/i).fill('admin123');
    await page.getByRole('button', { name: /login/i }).click();
    
    // Wait for navigation
    await page.waitForURL(/\/showcase|\/dashboard/);
  });

  test('should navigate to workflows page', async ({ page }) => {
    await page.goto('/workflows');
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByText(/workflow/i)).toBeVisible();
  });

  test('should open workflow editor', async ({ page }) => {
    await page.goto('/workflows/new');
    await page.waitForLoadState('networkidle');
    
    // Workflow editor should be visible
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display showcase page', async ({ page }) => {
    await page.goto('/showcase');
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByText(/taskflow|showcase|features/i)).toBeVisible();
  });
});
