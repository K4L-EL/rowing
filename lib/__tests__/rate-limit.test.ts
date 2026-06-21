import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, clearRateLimits } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    clearRateLimits();
  });

  it("allows requests under the limit", () => {
    expect(checkRateLimit("test-key", 3, 60000)).toBe(true);
    expect(checkRateLimit("test-key", 3, 60000)).toBe(true);
    expect(checkRateLimit("test-key", 3, 60000)).toBe(true);
  });

  it("blocks requests after exceeding the limit", () => {
    expect(checkRateLimit("test-key", 2, 60000)).toBe(true);
    expect(checkRateLimit("test-key", 2, 60000)).toBe(true);
    expect(checkRateLimit("test-key", 2, 60000)).toBe(false);
  });

  it("resets after window expires", async () => {
    expect(checkRateLimit("test-key", 1, 50)).toBe(true);
    expect(checkRateLimit("test-key", 1, 50)).toBe(false);

    await new Promise((resolve) => setTimeout(resolve, 60));

    expect(checkRateLimit("test-key", 1, 50)).toBe(true);
  });

  it("uses separate windows for different keys", () => {
    expect(checkRateLimit("key-a", 1, 60000)).toBe(true);
    expect(checkRateLimit("key-a", 1, 60000)).toBe(false);
    expect(checkRateLimit("key-b", 1, 60000)).toBe(true);
  });
});
