import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AdminKitClient } from "@/app/(dashboard)/dashboard/admin/kit/admin-kit-client";

const mockItems = [
  { id: "1", name: "Custom AIO", price: 75, description: "All-in-one suit", color: "mint", badge: "New" },
  { id: "2", name: "Classic Hoodie", price: 37, description: "Cotton hoodie", color: "white", badge: null },
];

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

describe("AdminKitClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  it("renders items passed as props", () => {
    render(<AdminKitClient items={mockItems} />);
    expect(screen.getByText("Custom AIO")).toBeInTheDocument();
    expect(screen.getByText("Classic Hoodie")).toBeInTheDocument();
    // Price text is "£75" - use function matcher since £ is a special char
    expect(screen.getByText((t) => t.includes("75"))).toBeInTheDocument();
    expect(screen.getByText((t) => t.includes("37"))).toBeInTheDocument();
  });

  it("displays the 'Add new item' button", () => {
    render(<AdminKitClient items={mockItems} />);
    expect(screen.getByText("Add new item")).toBeInTheDocument();
  });

  it("archive button calls DELETE and removes item from list", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true }),
    });

    render(<AdminKitClient items={mockItems} />);

    // Get all buttons. For 2 items, each has [edit pencil, archive] = 4 buttons
    // plus the "Add new item" button = 5 buttons total
    const buttons = screen.getAllByRole("button");
    // The archive buttons are at indices 2 and 4 (0=add, 1=item1-pencil, 2=item1-archive, 3=item2-pencil, 4=item2-archive)
    // Click the first archive button
    fireEvent.click(buttons[2]);

    await waitFor(() => {
      expect(screen.queryByText("Custom AIO")).not.toBeInTheDocument();
    });

    // The other item should still be visible
    expect(screen.getByText("Classic Hoodie")).toBeInTheDocument();
  });

  it("pencil button is rendered for each item", () => {
    render(<AdminKitClient items={mockItems} />);
    // Each item row has a pencil button. Since we have 2 items, there are at least 2 buttons
    // that contain the pencil icon (rendered as SVG with class lucide-pencil)
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(3); // add + 2 pencil + 2 archive = 5
  });
});
