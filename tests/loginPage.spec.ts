import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test('has title', async ({ page }) => {
  await page.goto(BASE_URL);

  await expect(page).toHaveTitle(/Expense Spreadsheet/);
});

test.describe('login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('sign in and go to dashboard', async ({ page }) => {
    await page.fill('input[name="username"]', 'vitorverrone');
    await page.fill('input[name="password"]', 'vitinho123');
    await page.click('button:has-text("Login")');

    const toast = page.locator('text=Logged in successfully');
    await expect(toast).toBeVisible();

    await expect(page).toHaveURL(`${BASE_URL}/dashboard`);
  });

  test('invalid username and show error', async ({ page }) => {
    await page.fill('input[name="username"]', 'lalalalala');
    await page.fill('input[name="password"]', 'vitinho123');
    await page.click('button:has-text("Login")');

    const toast = page.locator('text=Invalid username or password');
    await expect(toast).toBeVisible();

    await expect(page).toHaveURL(BASE_URL);
  });

  test('invalid password and show error', async ({ page }) => {
    await page.fill('input[name="username"]', 'vitorverrone');
    await page.fill('input[name="password"]', 'testestes');
    await page.click('button:has-text("Login")');

    const toast = page.locator('text=Invalid username or password');
    await expect(toast).toBeVisible();

    await expect(page).toHaveURL(BASE_URL);
  });

  test('invalid credentials and show error', async ({ page }) => {
    await page.fill('input[name="username"]', 'das987');
    await page.fill('input[name="password"]', 'a98s7da');
    await page.click('button:has-text("Login")');

    const toast = page.locator('text=Invalid username or password');
    await expect(toast).toBeVisible();
    
    await expect(page).toHaveURL(BASE_URL);
  });
});
