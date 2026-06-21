import { test, expect } from "@playwright/test";

test.describe("Role-based access control", () => {
  test("MEMBER cannot view crew builder save functionality", async ({ page }) => {
    // Log in as a regular member
    await page.goto("/login");
    await page.fill('input[name="email"]', "e2e-member@test.com");
    await page.fill('input[name="password"]', "testpassword123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);

    await page.goto("/dashboard/crew-builder");
    // Members should see a message, not the save button
    await expect(page.locator("text=Only coaches and admins")).toBeVisible({ timeout: 5000 });
    await expect(page.locator("text=Save crew sheet")).not.toBeVisible();
  });

  test("MEMBER cannot access admin page", async ({ page }) => {
    // Log in as a regular member
    await page.goto("/login");
    await page.fill('input[name="email"]', "e2e-member@test.com");
    await page.fill('input[name="password"]', "testpassword123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);

    await page.goto("/dashboard/admin");
    // Should not see admin content — expect redirect or 404
    await expect(page.locator("text=Admin")).not.toBeVisible();
  });

  test("ADMIN can view admin sections", async ({ page }) => {
    // Log in as admin
    await page.goto("/login");
    await page.fill('input[name="email"]', "e2e-admin@test.com");
    await page.fill('input[name="password"]', "testpassword123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);

    await page.goto("/dashboard/admin");
    // Admin should see the admin dashboard
    await expect(page.locator("h1")).toBeVisible({ timeout: 5000 });
  });
});
