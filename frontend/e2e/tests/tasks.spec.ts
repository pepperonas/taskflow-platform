import { test, expect } from '@playwright/test';

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByLabel(/username/i).fill('admin');
    await page.getByLabel(/password/i).fill('admin123');
    await page.getByRole('button', { name: /login/i }).click();
    
    // Wait for navigation
    await page.waitForURL(/\/showcase|\/dashboard/);
    
    // Navigate to tasks page
    await page.goto('/tasks');
    await page.waitForLoadState('networkidle');
  });

  test('should display tasks page', async ({ page }) => {
    await expect(page.getByText(/tasks/i)).toBeVisible();
  });

  test('should create a new task', async ({ page }) => {
    // Look for create task button
    const createButton = page.getByRole('button', { name: /create|new|add/i }).first();
    if (await createButton.isVisible()) {
      await createButton.click();
      
      // Fill task form
      await page.getByLabel(/title/i).fill('E2E Test Task');
      await page.getByLabel(/description/i).fill('This is a test task created by E2E test');
      
      // Submit form
      await page.getByRole('button', { name: /save|create|submit/i }).click();
      
      // Verify task appears in list
      await expect(page.getByText('E2E Test Task')).toBeVisible({ timeout: 10000 });
    }
  });

  test('should navigate to task detail', async ({ page }) => {
    // Wait for tasks to load
    await page.waitForSelector('[data-testid="task-item"], .task-item, a[href*="/tasks/"]', { timeout: 10000 });
    
    // Click on first task if available
    const firstTask = page.locator('[data-testid="task-item"], .task-item, a[href*="/tasks/"]').first();
    if (await firstTask.isVisible()) {
      await firstTask.click();
      await expect(page).toHaveURL(/\/tasks\/[a-f0-9-]+/);
    }
  });
});
