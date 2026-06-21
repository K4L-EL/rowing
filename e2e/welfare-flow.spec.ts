import { test, expect } from "@playwright/test";

test.describe("Welfare report flow", () => {
  test.beforeEach(async ({ page }) => {
    // Log in as a test user
    await page.goto("/login");
    await page.fill('input[name="email"]', "e2e-welfare@test.com");
    await page.fill('input[name="password"]', "testpassword123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);
  });

  test("creates a welfare report through the wizard", async ({ page }) => {
    await page.goto("/dashboard/welfare/new");

    // Step 1: Basic details
    await page.fill('input[name="subjectName"]', "Test Subject");
    await page.selectOption('select[name="subjectSquad"]', "SENIOR");
    await page.fill('input[name="subjectRole"]', "Rower");
    await page.fill('input[name="reporterEmail"]', "e2e-welfare@test.com");
    await page.click("text=Next");

    // Step 2: Nature of concern
    await page.fill("textarea", "Test concern description for E2E testing purposes");
    await page.selectOption('select[name="concernType"]', "SAFEGUARDING");
    await page.click("text=Next");

    // Step 3: Time and location
    await page.fill('input[name="whenDescription"]', "Yesterday");
    await page.fill('input[name="whereDescription"]', "Boathouse");
    await page.click("text=Next");

    // Continue through remaining steps quickly
    for (let i = 0; i < 6; i++) {
      await page.click("text=Next");
    }

    // Submit the report
    await page.click("text=Submit");

    // Should see success and land on the report list
    await expect(page.locator("text=submitted")).toBeVisible({ timeout: 10000 });
  });
});
