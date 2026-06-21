import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockAuth } = vi.hoisted(() => ({ mockAuth: vi.fn() }));
const { mockFindUnique, mockCreate, mockDelete } = vi.hoisted(() => ({
  mockFindUnique: vi.fn(),
  mockCreate: vi.fn(),
  mockDelete: vi.fn(),
}));
const { mockUserFindUnique, mockUserUpdate } = vi.hoisted(() => ({
  mockUserFindUnique: vi.fn(),
  mockUserUpdate: vi.fn(),
}));

vi.mock("@/auth", () => ({ auth: mockAuth }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    verificationToken: { findUnique: mockFindUnique, create: mockCreate, delete: mockDelete },
    user: { findUnique: mockUserFindUnique, update: mockUserUpdate },
  },
}));

const mockSendPasswordResetEmail = vi.fn();
vi.mock("@/lib/factories/email-service", () => ({
  createEmailService: vi.fn(() => ({
    sendPasswordResetEmail: mockSendPasswordResetEmail,
  })),
}));

import { requestResetAction, confirmResetAction } from "@/app/actions/reset-password";

describe("requestResetAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns ok for anonymous email (does not reveal existence)", async () => {
    mockUserFindUnique.mockResolvedValue(null);

    const result = await requestResetAction("nonexistent@test.com");
    expect(result.ok).toBe(true);
  });

  it("stores token and sends email for valid email", async () => {
    mockUserFindUnique.mockResolvedValue({ id: "user-1", email: "user@test.com" });
    mockCreate.mockResolvedValue({});

    const result = await requestResetAction("user@test.com");
    expect(result.ok).toBe(true);
    expect(mockCreate).toHaveBeenCalled();
    expect(mockSendPasswordResetEmail).toHaveBeenCalledWith("user@test.com", expect.stringContaining("/reset-password?token="));
  });
});

describe("confirmResetAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error for invalid token", async () => {
    mockFindUnique.mockResolvedValue(null);

    const result = await confirmResetAction("bad-token", "newpassword123");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("Invalid or expired");
    }
  });

  it("returns error for expired token", async () => {
    mockFindUnique.mockResolvedValue({
      token: "expired",
      identifier: "user@test.com",
      expires: new Date(Date.now() - 3600000),
    });

    const result = await confirmResetAction("expired", "newpassword123");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("expired");
    }
  });

  it("updates password and deletes token on success", async () => {
    mockFindUnique.mockResolvedValue({
      token: "valid-token",
      identifier: "user@test.com",
      expires: new Date(Date.now() + 3600000),
    });
    mockUserUpdate.mockResolvedValue({});
    mockDelete.mockResolvedValue({});

    const result = await confirmResetAction("valid-token", "newpassword123");
    expect(result.ok).toBe(true);
    expect(mockUserUpdate).toHaveBeenCalled();
    expect(mockDelete).toHaveBeenCalledWith({ where: { token: "valid-token" } });
  });
});
