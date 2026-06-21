import { test, expect } from "@playwright/test";

test.describe("Events", () => {
  test("member can view and book an event", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "member@rowsafe.club");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);

    await page.goto("/dashboard/events");
    // Events loaded from API
    await expect(page.locator("text=Annual Club Dinner")).toBeVisible({ timeout: 10000 });

    // Book the event
    await page.locator("text=Book a ticket").first().click();
    await expect(page.locator("text=Booked for")).toBeVisible({ timeout: 5000 });

    // The button should now say "Cancel booking"
    await expect(page.locator("text=Cancel booking")).toBeVisible();
  });

  test("admin can create an event", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "admin@rowsafe.club");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);

    await page.goto("/dashboard/admin/events");
    await page.fill('input[name="name"]', "E2E Test Event");
    await page.fill('input[name="date"]', "2027-01-15");
    await page.fill('input[name="venue"]', "Test Venue");
    await page.fill('textarea[name="desc"]', "An event created by E2E test");
    await page.fill('input[name="price"]', "25");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Event created")).toBeVisible({ timeout: 5000 });
  });
});
