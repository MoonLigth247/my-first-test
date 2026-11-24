import { test, expect } from '@playwright/test';

test.describe('SauceDemo Login and Logout Flow', () => {
  test('should login with valid credentials and logout', async ({ page }) => {
    await page.goto('/');

    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByText('Products')).toBeVisible();

    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByText('Logout').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('should show error message for invalid credentials', async ({ page }) => {
    await page.goto('/');

    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('wrong_password');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(
      page.getByText('Epic sadface: Username and password do not match any user in this service')
    ).toBeVisible();
  });

  test('should add item to cart and open shopping cart', async ({ page }) => {
    await page.goto('/');

    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.getByRole('button', { name: 'Add to cart' }).first().click();
    await page.locator('.shopping_cart_link').click();

    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.getByText('Your Cart')).toBeVisible();
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  });
});
