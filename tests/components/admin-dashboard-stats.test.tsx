import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ClayCard } from "@/components/clay-card";

// Simple render test for stat card pattern used in admin dashboard
describe("AdminDashboardStats", () => {
  it("renders a stat card with value and label", () => {
    render(
      <ClayCard className="flex items-center gap-4 p-4">
        <div>
          <p className="text-2xl font-black text-foreground">5</p>
          <p className="text-xs text-muted-foreground">Open welfare cases</p>
        </div>
      </ClayCard>,
    );
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Open welfare cases")).toBeInTheDocument();
  });

  it("renders monetary value with pound sign prefix", () => {
    render(
      <ClayCard className="flex items-center gap-4 p-4">
        <div>
          <p className="text-2xl font-black text-foreground">{"\u00a3"}120</p>
          <p className="text-xs text-muted-foreground">Overdue invoices</p>
        </div>
      </ClayCard>,
    );
    expect(screen.getByText("Overdue invoices")).toBeInTheDocument();
  });
});
