import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LiveStats } from "@/components/marketing/live-stats";

describe("LiveStats", () => {
  beforeEach(() => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockReset();
  });

  it("renders three counters after fetching", async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: () =>
        Promise.resolve({ reportCount: 15, memberCount: 42 }),
    });
    render(<LiveStats />);
    await waitFor(() => {
      expect(screen.getByText("Active members")).toBeInTheDocument();
      expect(screen.getByText("Welfare reports filed")).toBeInTheDocument();
      expect(screen.getByText("Free to start")).toBeInTheDocument();
    });
  });

  it("falls back to defaults when fetch fails", async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Network error"),
    );
    render(<LiveStats />);
    await waitFor(() => {
      expect(screen.getByText("Active members")).toBeInTheDocument();
    });
  });
});
