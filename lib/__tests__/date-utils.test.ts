import { describe, it, expect } from "vitest";
import { nextFourteenDays, toIsoDate, formatDay } from "@/lib/date-utils";

describe("nextFourteenDays", () => {
  it("returns exactly 14 Date objects", () => {
    const days = nextFourteenDays();
    expect(days).toHaveLength(14);
  });

  it("each item is a Date instance", () => {
    const days = nextFourteenDays();
    days.forEach((d) => expect(d).toBeInstanceOf(Date));
  });

  it("the first date is today (UTC-normalised)", () => {
    const days = nextFourteenDays();
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    expect(days[0].getTime()).toEqual(today.getTime());
  });

  it("dates are in ascending order", () => {
    const days = nextFourteenDays();
    for (let i = 1; i < days.length; i++) {
      expect(days[i].getTime()).toBeGreaterThan(days[i - 1].getTime());
    }
  });

  it("the 14th date is exactly 13 days after the first", () => {
    const days = nextFourteenDays();
    const diffMs = days[13].getTime() - days[0].getTime();
    expect(diffMs).toBe(13 * 24 * 60 * 60 * 1000);
  });
});

describe("toIsoDate", () => {
  it("returns YYYY-MM-DD format", () => {
    const d = new Date("2026-05-04T12:00:00Z");
    expect(toIsoDate(d)).toBe("2026-05-04");
  });

  it("works with a date at the end of the year", () => {
    const d = new Date("2026-12-31T23:59:00Z");
    expect(toIsoDate(d)).toBe("2026-12-31");
  });
});

describe("formatDay", () => {
  it("returns a string containing the date", () => {
    const d = new Date("2026-05-04T12:00:00Z");
    const result = formatDay(d);
    expect(result).toContain("May");
    expect(result).toContain("4");
  });
});
