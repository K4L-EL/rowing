import { test, expect } from "@playwright/test";

test.describe("Onboarding", () => {
  test("new user can register and start onboarding", async ({ page }) => {
    await page.goto("/register");

    await page.fill('input[name="email"]', "e2e-newuser@test.com");
    await page.fill('input[name="password"]', "testPassword123");
    await page.selectOption('select[name="squad"]', "SENIOR");
    await page.fill('input[name="name"]', "E2E New User");
    await page.click('button[type="submit"]');

    // Should redirect to onboarding
    await page.waitForURL(/\/onboarding/, { timeout: 15000 });

    // Onboarding wizard should be visible
    await expect(page.locator("text=Get started")).toBeVisible({ timeout: 10000 });
  });

  test("existing user is redirected to dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "member@rowsafe.club");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);

    await expect(page.locator("text=Dashboard")).toBeVisible({ timeout: 10000 });
  });
});
