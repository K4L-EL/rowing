import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { EventsCalendar } from "@/components/events/events-calendar";

const mockEvents = [
  { id: "e1", title: "Club Dinner", date: new Date(2026, 10, 14).toISOString(), time: "19:00", venue: "Clubhouse", price: 25 },
  { id: "e2", title: "Regatta", date: new Date(2026, 10, 20).toISOString(), time: "08:00", venue: "River", price: 15 },
];

describe("EventsCalendar", () => {
  it("renders day headers", () => {
    render(<EventsCalendar events={mockEvents} />);
    expect(screen.getByText("Mon")).toBeInTheDocument();
    expect(screen.getByText("Fri")).toBeInTheDocument();
  });
});
