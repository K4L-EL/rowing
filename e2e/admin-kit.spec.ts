import { test, expect } from "@playwright/test";

test.describe("Admin kit management", () => {
  test("admin can create a new kit item", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "admin@rowsafe.club");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);

    await page.goto("/dashboard/admin/kit");
    await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });

    // Open the Add dialog
    await page.locator("text=Add new item").click();

    // Fill the dialog form
    await page.fill('input[name="name"]', "E2E Test Item");
    await page.fill('input[name="price"]', "29.99");
    await page.fill("textarea", "Created by E2E test");

    // Submit
    await page.locator('button[type="submit"]').click();
    await expect(page.locator("text=Item created")).toBeVisible({ timeout: 5000 });
  });

  test("admin can archive a kit item", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "admin@rowsafe.club");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);

    await page.goto("/dashboard/admin/kit");
    await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });

    // Click the first archive button (button containing the Archive icon)
    await page.locator('button:has(svg[class*="lucide-archive"])').first().click();
    await expect(page.locator("text=Item archived")).toBeVisible({ timeout: 5000 });
  });
});
