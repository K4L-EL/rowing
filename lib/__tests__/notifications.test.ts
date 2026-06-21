import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockNotificationCreate } = vi.hoisted(() => ({
  mockNotificationCreate: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    notification: { create: mockNotificationCreate },
  },
}));

import { createNotification } from "@/lib/notifications";

describe("createNotification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("inserts a notification record", async () => {
    mockNotificationCreate.mockResolvedValue({ id: "notif-1" });

    await createNotification("user-1", "welfare_status", "Case updated", "Your case was updated", "/dashboard/welfare/abc");

    expect(mockNotificationCreate).toHaveBeenCalledWith({
      data: {
        userId: "user-1",
        type: "welfare_status",
        title: "Case updated",
        body: "Your case was updated",
        link: "/dashboard/welfare/abc",
      },
    });
  });
});
