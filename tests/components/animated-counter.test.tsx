import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AnimatedCounter } from "@/components/marketing/animated-counter";

describe("AnimatedCounter", () => {
  it("renders the label", () => {
    render(<AnimatedCounter target={42} suffix="+" label="Members" />);
    expect(screen.getByText("Members")).toBeInTheDocument();
  });

  it("renders the suffix", () => {
    render(<AnimatedCounter target={42} suffix="+" label="Members" />);
    expect(screen.getByText((content) => content.includes("+"))).toBeInTheDocument();
  });

  it("starts at 0", () => {
    render(<AnimatedCounter target={100} label="Test" />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
