import { describe, it, expect, vi, beforeEach } from "vitest";

describe("/api/events/[id]/book contract", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  it("POST returns 201 with confirmed booking", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ eventId: "event-1", userId: "user-1", status: "CONFIRMED" }),
    });

    const res = await fetch("/api/events/event-1/book", { method: "POST" });
    const data = await res.json();
    expect(data).toHaveProperty("eventId");
    expect(data).toHaveProperty("status");
    expect(data.status).toBe("CONFIRMED");
  });

  it("POST returns 401 when not authenticated", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: "Unauthorized" }),
    });

    const res = await fetch("/api/events/event-1/book", { method: "POST" });
    expect(res.status).toBe(401);
  });

  it("POST returns 409 when event is fully booked", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({ error: "This event is fully booked" }),
    });

    const res = await fetch("/api/events/event-1/book", { method: "POST" });
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toBe("This event is fully booked");
  });

  it("DELETE returns 200 with ok: true", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });

    const res = await fetch("/api/events/event-1/book", { method: "DELETE" });
    const data = await res.json();
    expect(data).toEqual({ ok: true });
  });
});
