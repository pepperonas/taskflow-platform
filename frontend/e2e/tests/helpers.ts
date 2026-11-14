import { Page, expect } from '@playwright/test';

// The UI is German; English alternatives are kept so the tests survive a
// language switch in either direction.
export const USERNAME = /username|benutzername/i;
export const PASSWORD = /password|passwort/i;
export const LOGIN_BUTTON = /^(login|anmelden)$/i;

export async function login(page: Page, username = 'admin', password = 'admin123') {
  await page.goto('/login');
  await page.getByLabel(USERNAME).fill(username);
  await page.getByLabel(PASSWORD).fill(password);
  await page.getByRole('button', { name: LOGIN_BUTTON }).click();
  await expect(page).toHaveURL(/\/showcase|\/dashboard/);
}
