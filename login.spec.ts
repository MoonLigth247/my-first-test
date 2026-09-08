import { test, expect } from '@playwright/test';

/**
 * F.CSA313 — Лаборатори №1: UI автомат тест (Playwright)
 * Тестийн сайт: https://www.saucedemo.com
 *
 * Locator-ийн талаар: Playwright-ийн зөвлөж буй "орчин үеийн" locator-уудыг
 * (getByRole, getByPlaceholder, getByText) ашигласан бөгөөд XPath огт
 * ашиглаагүй. XPath нь HTML бүтэц (div/span-ийн дараалал,埋 index г.м) өөрчлөгдвөл
 * амархан эвдэрдэг ("brittle"), унших/дэмжихэд хэцүү. Харин getByRole/
 * getByPlaceholder зэрэг нь хэрэглэгчийн харж, ойлгож буй байдлаар (дэлгэц дээрх
 * үүрэг, placeholder текст) элемент хайдаг тул HTML дотоод бүтэц өөрчлөгдсөн ч
 * тест тогтвортой ажиллана. Энэ нь Playwright баримт бичигт зөвлөдөг "user-facing
 * locator" зарчим юм.
 */

const VALID_USERNAME = 'standard_user';
const VALID_PASSWORD = 'secret_sauce';
const INVALID_PASSWORD = 'wrong_password';

test.describe('SauceDemo — нэвтрэх хуудасны тестүүд', () => {

  // Тест бүр шинэ, цэвэр browser context дээр ажилладаг тул
  // тест хоорондоо хамааралгүй (test isolation) — Playwright үүнийг автоматаар хангадаг.

  test('1. Амжилттай нэвтрэх — зөв нэр, нууц үгээр', async ({ page }) => {
    await page.goto('/');

    await page.getByPlaceholder('Username').fill(VALID_USERNAME);
    await page.getByPlaceholder('Password').fill(VALID_PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();

    // Амжилттай нэвтэрсний дараа "Products" хуудас руу шилжинэ
    await expect(page.getByText('Products')).toBeVisible();
    await expect(page).toHaveURL(/.*inventory.html/);

    // Логоут хийж тестээ зөв төгсгөнө (лабораторийн 5-р алхамын шаардлага)
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.getByPlaceholder('Username')).toBeVisible();
  });

  test('2. Амжилтгүй нэвтрэх — буруу нууц үгээр', async ({ page }) => {
    await page.goto('/');

    await page.getByPlaceholder('Username').fill(VALID_USERNAME);
    await page.getByPlaceholder('Password').fill(INVALID_PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();

    // Алдааны мессеж гарч, хэрэглэгч inventory хуудас руу шилжээгүй эсэхийг шалгана
    await expect(
      page.getByText('Epic sadface: Username and password do not match any user in this service')
    ).toBeVisible();
    await expect(page).not.toHaveURL(/.*inventory.html/);
  });

  test('3. Нэвтэрсний дараах үйлдэл — бараа сагслах', async ({ page }) => {
    await page.goto('/');

    await page.getByPlaceholder('Username').fill(VALID_USERNAME);
    await page.getByPlaceholder('Password').fill(VALID_PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Products')).toBeVisible();

    // "Sauce Labs Backpack" бараанд зориулсан "Add to cart" товчийг дарна
    await page
      .getByRole('button', { name: 'Add to cart' })
      .first()
      .click();

    // Сагсны тоолуур 1 болсныг шалгана
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // Сагс руу орж, бараа жагсаалтад орсныг баталгаажуулна
    await page.getByRole('link', { name: 'Shopping cart' }).click();
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page).toHaveURL(/.*cart.html/);

    // Тестээ логоутоор зөв төгсгөнө
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.getByPlaceholder('Username')).toBeVisible();
  });

});
