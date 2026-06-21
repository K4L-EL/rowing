import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { WelfarePagination } from "@/components/admin/welfare-pagination";

describe("WelfarePagination", () => {
  it("renders nothing when only 1 page", () => {
    const { container } = render(
      <WelfarePagination page={1} totalPages={1} basePath="/admin/welfare" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("disables Previous on page 1", () => {
    render(<WelfarePagination page={1} totalPages={3} basePath="/admin/welfare" />);
    const prevButton = screen.getByText("Previous").closest("button");
    expect(prevButton).toBeDisabled();
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
  });

  it("disables Next on last page", () => {
    render(<WelfarePagination page={3} totalPages={3} basePath="/admin/welfare" />);
    const nextButton = screen.getByText("Next").closest("button");
    expect(nextButton).toBeDisabled();
  });

  it("shows correct page counter", () => {
    render(<WelfarePagination page={2} totalPages={5} basePath="/admin/welfare" />);
    expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
  });
});
