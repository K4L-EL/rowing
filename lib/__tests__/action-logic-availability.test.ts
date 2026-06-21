import { describe, it, expect } from "vitest";
import { validateCrewSheetDate } from "@/lib/action-logic/availability";

describe("validateCrewSheetDate", () => {
  it("accepts a valid date string", () => {
    const result = validateCrewSheetDate("2026-05-09");
    expect(result).toBeInstanceOf(Date);
    expect(result!.toISOString().startsWith("2026-05-09")).toBe(true);
  });

  it("rejects an invalid date string", () => {
    expect(validateCrewSheetDate("not-a-date")).toBeNull();
  });

  it("rejects empty string", () => {
    expect(validateCrewSheetDate("")).toBeNull();
  });

  it("normalises the time to midnight UTC", () => {
    const result = validateCrewSheetDate("2026-06-15T14:30:00Z");
    expect(result!.getUTCHours()).toBe(0);
    expect(result!.getUTCMinutes()).toBe(0);
    expect(result!.getUTCSeconds()).toBe(0);
  });
});
