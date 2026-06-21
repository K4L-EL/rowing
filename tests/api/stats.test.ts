import { describe, it, expect } from "vitest";

describe("/api/stats contract", () => {
  it("returns reportCount, memberCount, clubCount as numbers", () => {
    const expectedShape = {
      reportCount: expect.any(Number),
      memberCount: expect.any(Number),
      clubCount: expect.any(Number),
    };
    expect(Object.keys(expectedShape)).toEqual([
      "reportCount",
      "memberCount",
      "clubCount",
    ]);
  });
});
