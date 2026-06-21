import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockAuth } = vi.hoisted(() => ({ mockAuth: vi.fn() }));
const { mockUserUpdate, mockUserFindUnique } = vi.hoisted(() => ({
  mockUserUpdate: vi.fn(),
  mockUserFindUnique: vi.fn(),
}));
const { mockBcryptCompare, mockBcryptHash } = vi.hoisted(() => ({
  mockBcryptCompare: vi.fn(),
  mockBcryptHash: vi.fn(),
}));

vi.mock("@/auth", () => ({ auth: mockAuth }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { update: mockUserUpdate, findUnique: mockUserFindUnique },
  },
}));
vi.mock("@/lib/factories/email-service", () => ({
  createEmailService: vi.fn(() => ({})),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("bcryptjs", () => ({
  default: {
    compare: mockBcryptCompare,
    hash: mockBcryptHash,
  },
  compare: mockBcryptCompare,
  hash: mockBcryptHash,
}));

import { updateProfileAction, changePasswordAction } from "@/app/actions/settings";

describe("updateProfileAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const result = await updateProfileAction({ name: "Test" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("Unauthorized");
    }
  });

  it("updates profile on success", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockUserUpdate.mockResolvedValue({});

    const result = await updateProfileAction({ name: "New Name", squad: "SENIOR" });
    expect(result.ok).toBe(true);
    expect(mockUserUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "user-1" },
        data: expect.objectContaining({ name: "New Name" }),
      }),
    );
  });
});

describe("changePasswordAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const result = await changePasswordAction("old", "newpassword123");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("Unauthorized");
    }
  });

  it("returns error when current password is wrong", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockUserFindUnique.mockResolvedValue({ passwordHash: "$2b$12$hashed" });
    mockBcryptCompare.mockResolvedValue(false);

    const result = await changePasswordAction("wrong", "newpassword123");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("Current password is incorrect");
    }
  });

  it("changes password on success", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockUserFindUnique.mockResolvedValue({ passwordHash: "$2b$12$hashed" });
    mockBcryptCompare.mockResolvedValue(true);
    mockBcryptHash.mockResolvedValue("$2b$12$newhash");

    const result = await changePasswordAction("correct", "newpassword123");
    expect(result.ok).toBe(true);
    expect(mockUserUpdate).toHaveBeenCalled();
  });
});
