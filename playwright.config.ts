import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright тохиргооны файл.
 * Дэлгэрэнгүй: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  // Тестүүд бие биенээсээ хамааралгүй тул зэрэгцээ ажиллуулж болно
  fullyParallel: true,

  // CI орчинд test.only үлдсэн бол build-ийг зогсооно
  forbidOnly: !!process.env.CI,

  // CI дээр амжилтгүй болсон тестийг дахин оролдоно
  retries: process.env.CI ? 2 : 0,

  // HTML тайлан үүсгэнэ (npx playwright show-report -ээр үзнэ)
  reporter: [['html', { open: 'never' }]],

  use: {
    // Бүх тестэд ашиглах суурь URL
    baseURL: 'https://www.saucedemo.com',

    // Алдаа гарсан тестийн trace-ийг хадгална (алхам мөшгих зорилгоор)
    trace: 'retain-on-failure',

    // Алдаа гарсан тестийн дэлгэцийн зургийг авна
    screenshot: 'only-on-failure',

    // Видео бичлэг (лабораторийн шаардлагын дагуу)
    video: 'retain-on-failure',
  },

  // Гурван гол хөтөч дээр тестээ шалгана
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
