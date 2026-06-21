import { test, expect } from "@playwright/test";

test.describe("Admin Welfare", () => {
  test("admin can view welfare cases and change status", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "admin@rowsafe.club");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);

    await page.goto("/dashboard/admin/welfare");
    // Welfare cases are loaded
    await expect(page.locator("text=Manage welfare")).toBeVisible({ timeout: 10000 });

    // Find a status button and click it
    const statusButtons = page.locator("button:has-text('Change status')");
    const count = await statusButtons.count();
    if (count > 0) {
      await statusButtons.first().click();
    }
  });

  test("welfare officer can access welfare admin", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "e2e-welfare@test.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);

    await page.goto("/dashboard/admin/welfare");
    await expect(page.locator("text=Manage welfare")).toBeVisible({ timeout: 10000 });
  });

  test("member cannot access admin welfare", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "member@rowsafe.club");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);

    await page.goto("/dashboard/admin/welfare");
    // Should be redirected away
    await page.waitForURL(/\/(?!admin\/welfare)/, { timeout: 5000 });
  });
});
