import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockUserCreate, mockUserFindUnique } = vi.hoisted(() => ({
  mockUserCreate: vi.fn(),
  mockUserFindUnique: vi.fn(),
}));
const { mockVerificationTokenCreate } = vi.hoisted(() => ({
  mockVerificationTokenCreate: vi.fn(),
}));
const { mockSendVerificationEmail } = vi.hoisted(() => ({
  mockSendVerificationEmail: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { create: mockUserCreate, findUnique: mockUserFindUnique },
    verificationToken: { create: mockVerificationTokenCreate },
  },
}));

vi.mock("@/lib/factories/email-service", () => ({
  createEmailService: vi.fn(() => ({
    sendVerificationEmail: mockSendVerificationEmail,
  })),
}));

vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));

import { registerAction } from "@/app/actions/register";

describe("registerAction with verification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates user and sends verification email", async () => {
    mockUserFindUnique.mockResolvedValue(null);
    mockUserCreate.mockResolvedValue({ id: "user-1" });
    mockVerificationTokenCreate.mockResolvedValue({});

    const formData = new FormData();
    formData.set("email", "test@example.com");
    formData.set("password", "password123");
    formData.set("squad", "SENIOR");
    formData.set("name", "Test User");

    const result = await registerAction({ success: false }, formData);
    expect(result.success).toBe(true);
    expect(mockUserCreate).toHaveBeenCalled();
    expect(mockVerificationTokenCreate).toHaveBeenCalled();
    expect(mockSendVerificationEmail).toHaveBeenCalledWith(
      "test@example.com",
      expect.stringContaining("/verify-email?token="),
    );
  });

  it("registers even if verification email fails (fire-and-forget)", async () => {
    mockUserFindUnique.mockResolvedValue(null);
    mockUserCreate.mockResolvedValue({ id: "user-1" });
    mockVerificationTokenCreate.mockRejectedValue(new Error("DB error"));

    const formData = new FormData();
    formData.set("email", "test@example.com");
    formData.set("password", "password123");
    formData.set("squad", "SENIOR");

    const result = await registerAction({ success: false }, formData);
    expect(result.success).toBe(true);
  });
});
