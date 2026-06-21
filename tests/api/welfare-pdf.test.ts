import { describe, it, expect, vi, beforeEach } from "vitest";

describe("/api/welfare-reports/[id]/pdf contract", () => {
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

    const res = await fetch("/api/welfare-reports/report-1/pdf");
    expect(res.status).toBe(401);
  });

  it("GET returns a buffer/response on success", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/pdf" }),
      json: async () => ({}),
    });

    const res = await fetch("/api/welfare-reports/report-1/pdf");
    expect(res.ok).toBe(true);
    expect(res.headers.get("content-type")).toBe("application/pdf");
  });
});
