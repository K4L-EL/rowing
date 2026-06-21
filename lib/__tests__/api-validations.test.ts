import { describe, it, expect } from "vitest";
import {
  createEventSchema,
  createKitItemSchema,
  updateKitItemSchema,
  createInvoiceSchema,
  updateInvoiceSchema,
} from "@/lib/validations/api";

describe("createEventSchema", () => {
  const valid = {
    title: "Annual Club Dinner",
    date: "2026-11-14",
    venue: "The Clubhouse",
    description: "Annual celebration",
    price: 65,
  };

  it("accepts valid input", () => {
    expect(createEventSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts optional fields", () => {
    const result = createEventSchema.safeParse({
      ...valid,
      time: "7:00 PM",
      capacity: 120,
      inviteOnly: false,
      menu: ["Starter", "Main"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing title", () => {
    const result = createEventSchema.safeParse({ ...valid, title: "" });
    expect(result.success).toBe(false);
  });

  it("rejects negative price", () => {
    const result = createEventSchema.safeParse({ ...valid, price: -1 });
    expect(result.success).toBe(false);
  });
});

describe("createKitItemSchema", () => {
  const valid = {
    name: "Custom AIO",
    price: 75,
    description: "All-in-one suit",
  };

  it("accepts valid input", () => {
    expect(createKitItemSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts optional fields", () => {
    const result = createKitItemSchema.safeParse({
      ...valid,
      color: "mint",
      badge: "New",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = createKitItemSchema.safeParse({ ...valid, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects negative price", () => {
    const result = createKitItemSchema.safeParse({ ...valid, price: -10 });
    expect(result.success).toBe(false);
  });
});

describe("updateKitItemSchema", () => {
  it("accepts partial update with just price", () => {
    expect(updateKitItemSchema.safeParse({ price: 80 }).success).toBe(true);
  });

  it("accepts partial update with just name", () => {
    expect(updateKitItemSchema.safeParse({ name: "New Name" }).success).toBe(true);
  });

  it("rejects negative price", () => {
    expect(updateKitItemSchema.safeParse({ price: -5 }).success).toBe(false);
  });

  it("accepts empty object (no fields to update)", () => {
    expect(updateKitItemSchema.safeParse({}).success).toBe(true);
  });
});

describe("createInvoiceSchema", () => {
  const valid = {
    userId: "user-1",
    title: "Regatta fee",
    amount: 45,
  };

  it("accepts valid input", () => {
    expect(createInvoiceSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects missing userId", () => {
    const result = createInvoiceSchema.safeParse({ ...valid, userId: "" });
    expect(result.success).toBe(false);
  });

  it("rejects negative amount", () => {
    const result = createInvoiceSchema.safeParse({ ...valid, amount: -10 });
    expect(result.success).toBe(false);
  });
});

describe("updateInvoiceSchema", () => {
  it("accepts valid status update", () => {
    expect(updateInvoiceSchema.safeParse({ status: "PAID" }).success).toBe(true);
  });

  it("accepts partial update", () => {
    expect(updateInvoiceSchema.safeParse({ title: "New title" }).success).toBe(true);
  });

  it("rejects invalid status", () => {
    const result = updateInvoiceSchema.safeParse({ status: "INVALID" });
    expect(result.success).toBe(false);
  });
});
