import { test, expect } from '@playwright/test';
import { USERNAME, PASSWORD, LOGIN_BUTTON, login } from './helpers';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.getByLabel(USERNAME)).toBeVisible();
    await expect(page.getByLabel(PASSWORD)).toBeVisible();
    await expect(page.getByRole('button', { name: LOGIN_BUTTON })).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await login(page);
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.getByLabel(USERNAME).fill('invalid');
    await page.getByLabel(PASSWORD).fill('wrongpassword');
    await page.getByRole('button', { name: LOGIN_BUTTON }).click();

    await expect(page.getByRole('alert')).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('should navigate to register page', async ({ page }) => {
    await page.getByRole('link', { name: /register|registrieren|sign up/i }).click();
    await expect(page).toHaveURL(/\/register/);
  });
});
