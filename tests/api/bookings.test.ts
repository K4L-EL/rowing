import { describe, it, expect, vi, beforeEach } from "vitest";

describe("/api/bookings contract", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  it("GET returns 401 without auth", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: "Unauthorized" }),
    });

    const res = await fetch("/api/bookings");
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("GET returns array of eventIds", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ["event-1", "event-3"],
    });

    const data = await fetch("/api/bookings").then((r) => r.json());
    expect(Array.isArray(data)).toBe(true);
    expect(data).toContain("event-1");
    expect(data).toContain("event-3");
  });
});
