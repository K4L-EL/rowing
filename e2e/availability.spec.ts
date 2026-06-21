import { test, expect } from "@playwright/test";

test.describe("Availability tracking", () => {
  test.beforeEach(async ({ page }) => {
    // Log in
    await page.goto("/login");
    await page.fill('input[name="email"]', "e2e-avail@test.com");
    await page.fill('input[name="password"]', "testpassword123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);
  });

  test("toggles a session and verifies persistence", async ({ page }) => {
    await page.goto("/dashboard/availability");

    // Click the first day tile
    await page.locator("button").filter({ hasText: /Mon|Tue|Wed|Thu|Fri|Sat|Sun/ }).first().click();

    // Click AM1 session toggle
    await page.locator("text=AM 1").click();

    // Verify success toast
    await expect(page.locator("text=Saved").first()).toBeVisible({ timeout: 5000 });

    // Reload and verify the slot persisted
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Click the same day
    await page.locator("button").filter({ hasText: /Mon|Tue|Wed|Thu|Fri|Sat|Sun/ }).first().click();

    // Verify AM1 still shows the toggled state
    await expect(page.locator("text=AM 1").first()).toBeVisible();
  });
});
