import { test, expect } from "@playwright/test";

test.describe("Kit Orders", () => {
  test("member can view empty order history", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "junior@rowsafe.club");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);

    await page.goto("/dashboard/kit/orders");
    await expect(page.locator("text=No orders yet.")).toBeVisible({ timeout: 10000 });
  });

  test("member can view order history after placing an order", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "member@rowsafe.club");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);

    // Place an order from the kit shop
    await page.goto("/dashboard/kit");
    await page.locator("text=Add to basket").first().click();
    await expect(page.locator("text=Added to basket")).toBeVisible({ timeout: 5000 });

    // View orders
    await page.goto("/dashboard/kit/orders");
    await expect(page.locator("text=My orders")).toBeVisible({ timeout: 10000 });
  });
});
