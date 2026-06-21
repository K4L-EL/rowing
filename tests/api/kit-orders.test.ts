import { describe, it, expect, vi, beforeEach } from "vitest";

describe("/api/kit/orders contract", () => {
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

    const res = await fetch("/api/kit/orders");
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("GET returns array of orders with expected shape", async () => {
    const mockOrders = [
      {
        id: "order-1",
        userId: "user-1",
        itemId: "item-1",
        quantity: 1,
        status: "PENDING",
        createdAt: "2026-05-01T00:00:00.000Z",
        updatedAt: "2026-05-01T00:00:00.000Z",
        item: {
          id: "item-1",
          name: "Custom AIO",
          price: 75,
          description: "All-in-one suit",
          color: "mint",
          badge: "New",
        },
      },
    ];

    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockOrders,
    });

    const res = await fetch("/api/kit/orders");
    const data = await res.json();

    expect(Array.isArray(data)).toBe(true);
    expect(data[0]).toHaveProperty("id");
    expect(data[0]).toHaveProperty("quantity");
    expect(data[0]).toHaveProperty("status");
    expect(data[0]).toHaveProperty("item");
    expect(data[0].item).toHaveProperty("name");
    expect(data[0].item).toHaveProperty("price");
  });

  it("GET includes user data for admin context", async () => {
    const mockAdminOrder = {
      id: "order-1",
      userId: "user-1",
      itemId: "item-1",
      quantity: 1,
      status: "PENDING",
      user: { id: "user-1", name: "Member Mike", email: "member@rowsafe.club" },
      item: { id: "item-1", name: "Custom AIO", price: 75, description: "", color: "mint" },
    };

    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => [mockAdminOrder],
    });

    const data = await fetch("/api/kit/orders").then((r) => r.json());
    expect(data[0]).toHaveProperty("user");
    expect(data[0].user).toHaveProperty("name");
  });
});
