import { test, expect } from '@playwright/test';
import { login } from './helpers';

async function createTask(page: import('@playwright/test').Page, title: string) {
  await page.getByRole('button', { name: 'add' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel(/title|titel/i).fill(title);
  await dialog.getByLabel(/description|beschreibung/i).fill('Created by the E2E suite');
  await dialog.getByRole('button', { name: /^(create|erstellen|save|speichern)$/i }).click();
  await expect(page.getByText(title)).toBeVisible({ timeout: 10000 });
}

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/tasks');
  });

  test('should display tasks page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /^(tasks|aufgaben)$/i })).toBeVisible();
  });

  test('should create a new task', async ({ page }) => {
    await createTask(page, `E2E Task ${Date.now()}`);
  });

  test('should navigate to task detail', async ({ page }) => {
    const title = `E2E Detail ${Date.now()}`;
    await createTask(page, title);
    await page.getByText(title).click();
    await expect(page).toHaveURL(/\/tasks\/[a-f0-9-]+/);
  });
});
