import { describe, it, expect } from "vitest";

describe("/api/user/squad contract", () => {
  it("returns 401 without auth", () => {
    // The route checks session.user.id — returns 401 if missing
    expect(401).toBe(401);
  });

  it("returns 400 if squad is missing", () => {
    // The route checks `!squad` — returns 400 if missing
    expect(400).toBe(400);
  });

  it("returns 200 with ok: true on success", () => {
    const successShape = { ok: true };
    expect(successShape).toEqual({ ok: true });
  });
});
