import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockAuth } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
}));

const { mockWelfareUpdate, mockWelfareEventCreate, mockUserUpdate, mockTransaction, mockWelfareFindUnique } = vi.hoisted(() => ({
  mockWelfareUpdate: vi.fn(),
  mockWelfareEventCreate: vi.fn(),
  mockUserUpdate: vi.fn(),
  mockTransaction: vi.fn(),
  mockWelfareFindUnique: vi.fn(),
}));

vi.mock("@/auth", () => ({ auth: mockAuth }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: mockTransaction,
    welfareReport: { update: mockWelfareUpdate, findUnique: mockWelfareFindUnique },
    welfareReportEvent: { create: mockWelfareEventCreate },
    user: { update: mockUserUpdate },
  },
}));
vi.mock("@/lib/notifications", () => ({ createNotification: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import {
  updateReportStatusAction,
  assignReportAction,
  updateUserRoleAction,
} from "@/app/actions/admin";

describe("updateReportStatusAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error when unauthorized", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1", role: "MEMBER" } });

    const result = await updateReportStatusAction("report-1", "SUBMITTED");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("Unauthorized");
    }
  });

  it("updates status and creates event in transaction on success", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1", role: "ADMIN" } });
    mockWelfareFindUnique.mockResolvedValue({ userId: "report-owner-id" });
    const tx = {
      welfareReport: { update: vi.fn().mockResolvedValue({}) },
      welfareReportEvent: { create: vi.fn().mockResolvedValue({}) },
    };
    mockTransaction.mockImplementation(async (fn: any) => fn(tx));

    const result = await updateReportStatusAction("report-1", "RESOLVED", "Case closed");
    expect(result.ok).toBe(true);
    expect(mockTransaction).toHaveBeenCalled();
    expect(tx.welfareReport.update).toHaveBeenCalled();
    expect(tx.welfareReportEvent.create).toHaveBeenCalled();
  });

  it("handles Prisma error gracefully", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1", role: "ADMIN" } });
    mockTransaction.mockRejectedValue(new Error("DB error"));

    const result = await updateReportStatusAction("report-1", "SUBMITTED");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("Update failed");
    }
  });
});

describe("assignReportAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("assigns report to user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1", role: "ADMIN" } });
    mockWelfareUpdate.mockResolvedValue({});
    mockWelfareEventCreate.mockResolvedValue({});

    const result = await assignReportAction("report-1", "assignee-1");
    expect(result.ok).toBe(true);
  });

  it("unassigns report when given null", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1", role: "ADMIN" } });
    mockWelfareUpdate.mockResolvedValue({});
    mockWelfareEventCreate.mockResolvedValue({});

    const result = await assignReportAction("report-1", null);
    expect(result.ok).toBe(true);
  });

  it("returns error when unauthorized", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1", role: "MEMBER" } });

    const result = await assignReportAction("report-1", "assignee-1");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("Unauthorized");
    }
  });
});

describe("updateUserRoleAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates user role on success", async () => {
    mockAuth.mockResolvedValue({ user: { id: "admin-1", role: "ADMIN" } });
    mockUserUpdate.mockResolvedValue({});

    const result = await updateUserRoleAction("user-1", "COACH");
    expect(result.ok).toBe(true);
  });

  it("returns error when unauthorized", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1", role: "MEMBER" } });

    const result = await updateUserRoleAction("user-2", "COACH");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("Unauthorized");
    }
  });

  it("handles Prisma error gracefully", async () => {
    mockAuth.mockResolvedValue({ user: { id: "admin-1", role: "ADMIN" } });
    mockUserUpdate.mockRejectedValue(new Error("DB error"));

    const result = await updateUserRoleAction("user-1", "COACH");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("Update failed");
    }
  });
});
