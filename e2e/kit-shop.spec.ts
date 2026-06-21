import { test, expect } from "@playwright/test";

test.describe("Kit shop", () => {
  test("member can view kit items and add to basket", async ({ page }) => {
    // Login as a seeded member
    await page.goto("/login");
    await page.fill('input[name="email"]', "member@rowsafe.club");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);

    await page.goto("/dashboard/kit");
    // Should see kit items loaded from API
    await expect(page.locator("text=Custom AIO")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=Classic Hoodie")).toBeVisible();

    // Add an item to basket
    await page.locator("text=Add").first().click();
    await expect(page.locator("text=added to basket")).toBeVisible({ timeout: 5000 });
  });
});
