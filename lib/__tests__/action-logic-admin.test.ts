import { describe, it, expect } from "vitest";
import {
  buildStatusChangeNote,
  buildAssignNote,
} from "@/lib/action-logic/admin";

describe("buildStatusChangeNote", () => {
  it("uses the provided note when given", () => {
    expect(buildStatusChangeNote("SUBMITTED", "Reviewed by welfare")).toBe(
      "Reviewed by welfare",
    );
  });

  it("falls back to default message when note is empty", () => {
    expect(buildStatusChangeNote("RESOLVED", "")).toBe(
      "Status updated to RESOLVED",
    );
  });

  it("falls back to default when note is only whitespace", () => {
    expect(buildStatusChangeNote("ASSIGNED", "   ")).toBe(
      "Status updated to ASSIGNED",
    );
  });

  it("falls back to default when note is undefined", () => {
    expect(buildStatusChangeNote("REVIEWED")).toBe(
      "Status updated to REVIEWED",
    );
  });
});

describe("buildAssignNote", () => {
  it("returns Unassigned when assignedToId is null", () => {
    expect(buildAssignNote(null)).toBe("Unassigned");
  });

  it("returns assignment message with userId", () => {
    const result = buildAssignNote("user_123");
    expect(result).toContain("user_123");
    expect(result).toContain("Assigned to user");
  });

  it("includes notes when provided", () => {
    const result = buildAssignNote("user_123", "Taking lead on this case");
    expect(result).toContain("Taking lead on this case");
  });
});
