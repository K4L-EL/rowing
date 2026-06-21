import { test, expect } from "@playwright/test";

test.describe("Accounting", () => {
  test("admin can create an invoice", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "admin@rowsafe.club");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);

    await page.goto("/dashboard/admin/accounting");
    await expect(page.locator("text=New one-off invoice")).toBeVisible({ timeout: 10000 });
    await page.locator("text=New one-off invoice").click();

    // Dialog should open
    await expect(page.locator("text=Create invoice")).toBeVisible({ timeout: 5000 });
    await page.fill('input[name="title"]', "E2E Test Invoice");
    await page.fill('input[name="amount"]', "50");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=E2E Test Invoice")).toBeVisible({ timeout: 5000 });
  });

  test("member can view their invoices", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "member@rowsafe.club");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);

    await page.goto("/dashboard/accounting");
    await expect(page.locator("text=Accounting")).toBeVisible({ timeout: 10000 });
  });
});
