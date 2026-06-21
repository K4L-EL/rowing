import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AdminEventsList } from "@/app/(dashboard)/dashboard/admin/events/admin-events-list";

const mockEvents = [
  { id: "1", title: "Annual Club Dinner", date: new Date("2026-11-14"), venue: "The Clubhouse", price: 65 },
  { id: "2", title: "Winter Head Regatta", date: new Date("2027-02-07"), venue: "City Lake", price: 15 },
];

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

describe("AdminEventsList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  it("renders events passed as props", () => {
    render(<AdminEventsList events={mockEvents} />);
    expect(screen.getByText("Annual Club Dinner")).toBeInTheDocument();
    expect(screen.getByText("Winter Head Regatta")).toBeInTheDocument();
    // Venue text is mixed with other text in the DOM, use function matcher
    expect(
      screen.getByText((content) => content.includes("The Clubhouse")),
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes("City Lake")),
    ).toBeInTheDocument();
    expect(screen.getByText("Existing events")).toBeInTheDocument();
  });

  it("shows empty state when no events", () => {
    render(<AdminEventsList events={[]} />);
    expect(screen.getByText("No events created yet.")).toBeInTheDocument();
  });

  it("delete button calls DELETE and removes event from list", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true }),
    });

    render(<AdminEventsList events={mockEvents} />);

    // Get all buttons (pencil + trash for each event = 4 buttons)
    const buttons = screen.getAllByRole("button");
    // The trash icons have class "lucide-trash-2", look for the second button
    // in each row. Row 1 buttons: [pencil, trash]. Row 2: [pencil, trash].
    // Click the first trash button (index 1 in the list)
    fireEvent.click(buttons[1]);

    await waitFor(() => {
      expect(screen.queryByText("Annual Club Dinner")).not.toBeInTheDocument();
    });

    // The other event should still be visible
    expect(screen.getByText("Winter Head Regatta")).toBeInTheDocument();
  });
});
