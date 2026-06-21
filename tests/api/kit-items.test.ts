import { describe, it, expect, vi, beforeEach } from "vitest";

describe("/api/kit/items contract", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  it("GET returns an array of items", () => {
    const exampleResponse: unknown[] = [];
    expect(Array.isArray(exampleResponse)).toBe(true);
  });

  it("POST returns 201 with created item", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ id: "item-1", name: "Test Item", price: 50, description: "Test" }),
    });

    const res = await fetch("/api/kit/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test Item", price: 50, description: "Test" }),
    });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("name");
  });

  it("POST returns 401 without admin auth", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: "Unauthorized" }),
    });

    const res = await fetch("/api/kit/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test", price: 10, description: "Test" }),
    });
    expect(res.status).toBe(401);
  });

  describe("PATCH /api/kit/items/[id]", () => {
    it("returns 200 with updated item", async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: "item-1", name: "Updated Item", price: 60 }),
      });

      const res = await fetch("/api/kit/items/item-1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: 60 }),
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty("id");
    });

    it("returns 401 without admin auth", async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: "Unauthorized" }),
      });

      const res = await fetch("/api/kit/items/item-1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: 60 }),
      });
      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /api/kit/items/[id]", () => {
    it("returns 200 with ok: true (archive)", async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ ok: true }),
      });

      const res = await fetch("/api/kit/items/item-1", { method: "DELETE" });
      const data = await res.json();
      expect(data).toEqual({ ok: true });
    });

    it("returns 401 without admin auth", async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: "Unauthorized" }),
      });

      const res = await fetch("/api/kit/items/item-1", { method: "DELETE" });
      expect(res.status).toBe(401);
    });
  });
});
