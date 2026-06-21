import { test, expect } from "@playwright/test";

test.describe("Registration flow", () => {
  test("visits /register, fills form, and lands on welcome page", async ({ page }) => {
    await page.goto("/register");

    // Fill in the registration form
    await page.fill('input[name="name"]', "E2E Test User");
    await page.fill('input[name="email"]', `e2e-${Date.now()}@test.com`);
    await page.fill('input[name="password"]', "testpassword123");
    await page.selectOption('select[name="squad"]', "SENIOR");

    // Submit
    await page.click('button[type="submit"]');

    // Should land on the welcome/onboarding page
    await page.waitForURL(/\/dashboard\/welcome/);
    await expect(page.locator("text=Get Started")).toBeVisible({ timeout: 10000 });
  });

  test("shows validation errors for empty fields", async ({ page }) => {
    await page.goto("/register");

    // Submit without filling anything
    await page.click('button[type="submit"]');

    // Should show error messages
    await expect(page.locator("text=required").first()).toBeVisible({ timeout: 5000 });
  });
});
