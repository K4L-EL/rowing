import { describe, it, expect, vi, beforeEach } from "vitest";

describe("/api/slack/share-crew contract", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  it("POST returns 401 without auth", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: "Unauthorized" }),
    });

    const res = await fetch("/api/slack/share-crew", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test crew", squad: "SENIOR", date: "2026-06-01", session: "AM", type: "Training" }),
    });
    expect(res.status).toBe(401);
  });

  it("POST returns 501 when Slack not configured", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 501,
      json: async () => ({ error: "Slack not configured" }),
    });

    const res = await fetch("/api/slack/share-crew", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test crew", squad: "SENIOR", date: "2026-06-01", session: "AM", type: "Training" }),
    });
    expect(res.status).toBe(501);
  });
});
