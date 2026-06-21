import { describe, it, expect } from "vitest";
import { reportStatusLabel } from "@/lib/welfare-status";

describe("reportStatusLabel", () => {
  it("returns human-readable labels for each status", () => {
    expect(reportStatusLabel("SUBMITTED")).toBe("Submitted");
    expect(reportStatusLabel("REVIEWED")).toBe("Reviewed");
    expect(reportStatusLabel("ASSIGNED")).toBe("Assigned");
    expect(reportStatusLabel("UNDER_DISCUSSION")).toBe("Under discussion");
    expect(reportStatusLabel("RESOLVED")).toBe("Resolved");
  });

  it("returns the raw status for unknown values", () => {
    expect(reportStatusLabel("UNKNOWN")).toBe("UNKNOWN");
    expect(reportStatusLabel("")).toBe("");
  });
});
