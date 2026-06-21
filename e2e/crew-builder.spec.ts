import { test, expect } from "@playwright/test";

test.describe("Crew builder", () => {
  test.beforeEach(async ({ page }) => {
    // Log in as a coach
    await page.goto("/login");
    await page.fill('input[name="email"]', "e2e-coach@test.com");
    await page.fill('input[name="password"]', "testpassword123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);
  });

  test("completes the crew builder wizard steps", async ({ page }) => {
    await page.goto("/dashboard/crew-builder");

    // Step 1: Select squad
    await page.selectOption('select', 'SENIOR');
    await page.click("text=Next");

    // Step 2: Select date (first available)
    await page.locator("button").filter({ hasText: /Mon|Tue|Wed|Thu|Fri|Sat|Sun/ }).first().click();
    await page.click("text=Next");

    // Step 3: Select session
    await page.click("text=AM 1");
    await page.click("text=Next");

    // Step 4: Select type (Water)
    await page.click("text=Water");
    await page.click("text=Next");

    // Step 5: Build — fill crew name and save
    await page.fill('input[id="crewName"]', "E2E Test Crew");
    await page.click("text=Save crew sheet");

    // Verify success
    await expect(page.locator("text=Crew sheet saved")).toBeVisible({ timeout: 10000 });
  });
});
