import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { RotatingTestimonials } from "@/components/marketing/rotating-testimonials";

const MOCK = [
  {
    quote: "First quote",
    name: "Alice",
    role: "Coach",
    color: "white" as const,
    initials: "A",
  },
  {
    quote: "Second quote",
    name: "Bob",
    role: "Welfare",
    color: "bluePale" as const,
    initials: "B",
  },
];

describe("RotatingTestimonials", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("shows the first testimonial initially", () => {
    render(<RotatingTestimonials testimonials={MOCK} />);
    const aliceElements = screen.getAllByText("Alice");
    expect(aliceElements.length).toBeGreaterThan(0);
  });

  it("rotates to the next testimonial after 5 seconds", () => {
    render(<RotatingTestimonials testimonials={MOCK} />);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    const bobElements = screen.getAllByText("Bob");
    expect(bobElements.length).toBeGreaterThan(0);
  });

  it("returns nothing for empty testimonials array", () => {
    const { container } = render(<RotatingTestimonials testimonials={[]} />);
    expect(container.innerHTML).toBe("");
  });
});
