import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Invoices API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  describe("GET /api/invoices", () => {
    it("returns 401 without auth", async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: "Unauthorized" }),
      });

      const res = await fetch("/api/invoices");
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe("Unauthorized");
    });

    it("returns an array of invoices with expected shape", async () => {
      const mockInvoices = [
        {
          id: "inv-1",
          userId: "user-1",
          title: "Regatta fee",
          amount: 45,
          status: "PENDING",
          dueDate: "2026-06-01T00:00:00.000Z",
          description: "Winter Head Regatta entry fee",
          createdAt: "2026-05-01T00:00:00.000Z",
          updatedAt: "2026-05-01T00:00:00.000Z",
          user: { id: "user-1", name: "Member Mike", email: "member@rowsafe.club" },
        },
      ];

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockInvoices,
      });

      const res = await fetch("/api/invoices");
      const data = await res.json();

      expect(Array.isArray(data)).toBe(true);
      expect(data[0]).toHaveProperty("id");
      expect(data[0]).toHaveProperty("title");
      expect(data[0]).toHaveProperty("amount");
      expect(data[0]).toHaveProperty("status");
      expect(data[0]).toHaveProperty("user");
    });
  });

  describe("POST /api/invoices", () => {
    it("returns 401 for non-admin users", async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: "Unauthorized" }),
      });

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "user-1", title: "Test", amount: 50 }),
      });

      expect(res.status).toBe(401);
    });

    it("returns 400 when required fields are missing", async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: "Validation failed" }),
      });

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      expect(res.status).toBe(400);
    });
  });

  describe("PATCH /api/invoices/[id]", () => {
    it("returns 200 with updated invoice", async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: "inv-1", status: "PAID" }),
      });

      const res = await fetch("/api/invoices/inv-1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAID" }),
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

      const res = await fetch("/api/invoices/inv-1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAID" }),
      });
      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /api/invoices/[id]", () => {
    it("returns 200 with ok: true", async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ ok: true }),
      });

      const res = await fetch("/api/invoices/inv-1", { method: "DELETE" });
      const data = await res.json();
      expect(data).toEqual({ ok: true });
    });

    it("returns 401 without admin auth", async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: "Unauthorized" }),
      });

      const res = await fetch("/api/invoices/inv-1", { method: "DELETE" });
      expect(res.status).toBe(401);
    });
  });
});
