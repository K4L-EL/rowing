import { describe, it, expect } from "vitest";
import { z } from "zod";

// Extract the register schema inline for isolated testing
const registerSchema = z.object({
  name: z.string().max(120).optional(),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  squad: z.string().min(1, "Squad is required"),
});

describe("registerSchema", () => {
  it("accepts valid registration data", () => {
    const result = registerSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      squad: "SENIOR",
    });
    expect(result.success).toBe(true);
  });

  it("accepts registration without optional name", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "password123",
      squad: "SENIOR",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing squad", () => {
    const result = registerSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      squad: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.squad).toBeDefined();
    }
  });

  it("rejects invalid email", () => {
    const result = registerSchema.safeParse({
      name: "Test User",
      email: "not-an-email",
      password: "password123",
      squad: "SENIOR",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("rejects short password (less than 8 characters)", () => {
    const result = registerSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      password: "short",
      squad: "SENIOR",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toBeDefined();
    }
  });

  it("rejects empty email", () => {
    const result = registerSchema.safeParse({
      name: "Test User",
      email: "",
      password: "password123",
      squad: "SENIOR",
    });
    expect(result.success).toBe(false);
  });
});
