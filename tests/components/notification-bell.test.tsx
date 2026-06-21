import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotificationBell } from "@/components/notifications/notification-bell";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("NotificationBell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders bell icon with 0 unread", async () => {
    mockFetch.mockResolvedValue({ json: () => Promise.resolve([]), ok: true });

    await act(async () => {
      render(<NotificationBell />);
    });

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });
});
