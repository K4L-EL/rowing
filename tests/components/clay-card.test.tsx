import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ClayCard } from "@/components/clay-card";

describe("ClayCard", () => {
  it("renders children", () => {
    render(<ClayCard>Hello</ClayCard>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("applies the correct color class", () => {
    const { container } = render(<ClayCard color="mint" />);
    expect(container.firstChild).toHaveClass("bg-clay-mint");
  });

  it("applies clay-pressed when pressed is true", () => {
    const { container } = render(<ClayCard pressed />);
    expect(container.firstChild).toHaveClass("clay-pressed");
  });

  it("defaults to white color and clay class", () => {
    const { container } = render(<ClayCard />);
    expect(container.firstChild).toHaveClass("bg-white");
    expect(container.firstChild).toHaveClass("clay");
  });
});
