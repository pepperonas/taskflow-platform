import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('Workflow Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should navigate to workflows page', async ({ page }) => {
    await page.goto('/workflows');
    await expect(page.getByRole('heading', { name: /workflow/i }).first()).toBeVisible();
  });

  test('should open workflow editor', async ({ page }) => {
    await page.goto('/workflows/new');
    await expect(page).toHaveURL(/\/workflows\/new/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display showcase page', async ({ page }) => {
    await page.goto('/showcase');
    await expect(page.getByRole('heading', { name: /taskflow|showcase|features/i }).first()).toBeVisible();
  });
});
