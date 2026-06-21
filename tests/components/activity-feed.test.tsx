import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ActivityFeed } from "@/components/dashboard/activity-feed";

const mockReports = [
  { id: "report-1", status: "SUBMITTED", createdAt: new Date("2026-05-01") },
];

const mockEvents = [
  { id: "event-1", title: "Club Dinner", date: new Date("2026-11-14"), venue: "The Clubhouse" },
];

const mockInvoices = [
  { id: "inv-1", title: "Regatta fee", amount: 45, status: "PENDING" },
];

const mockOrders = [
  { id: "order-1", createdAt: new Date("2026-05-01"), status: "PENDING", item: { name: "Custom AIO" } },
];

describe("ActivityFeed", () => {
  it("renders empty state with welcome message", () => {
    render(<ActivityFeed />);
    expect(screen.getByText("Welcome to RowSafe")).toBeInTheDocument();
    expect(screen.getByText("File a welfare report")).toBeInTheDocument();
  });

  it("renders welfare reports section", () => {
    render(<ActivityFeed reports={mockReports} />);
    expect(screen.getByText(/report-1/)).toBeInTheDocument();
    expect(screen.getByText("Recent welfare reports")).toBeInTheDocument();
  });

  it("renders events section", () => {
    render(<ActivityFeed events={mockEvents} />);
    expect(screen.getByText("Club Dinner")).toBeInTheDocument();
    expect(screen.getByText("Upcoming events")).toBeInTheDocument();
  });

  it("renders invoices section", () => {
    render(<ActivityFeed invoices={mockInvoices} />);
    expect(screen.getByText("Regatta fee")).toBeInTheDocument();
    expect(screen.getByText("Recent invoices")).toBeInTheDocument();
  });

  it("renders orders section", () => {
    render(<ActivityFeed orders={mockOrders} />);
    expect(screen.getByText("Custom AIO")).toBeInTheDocument();
    expect(screen.getByText("Recent orders")).toBeInTheDocument();
  });
});
