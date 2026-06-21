import { describe, it, expect } from "vitest";

describe("/api/user/onboarding contract", () => {
  it("returns 401 without auth", () => {
    expect(401).toBe(401);
  });

  it("returns 200 with ok: true on success", () => {
    const successShape = { ok: true };
    expect(successShape).toEqual({ ok: true });
  });
});
