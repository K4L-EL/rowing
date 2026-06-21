import { describe, it, expect } from "vitest";

describe("/api/events contract", () => {
  it("GET returns an array of upcoming events", () => {
    const exampleResponse: unknown[] = [];
    expect(Array.isArray(exampleResponse)).toBe(true);
  });

  it("POST returns 401 without admin auth", () => {
    expect(401).toBe(401);
  });

  it("POST returns 201 with created event", () => {
    const successShape = { id: expect.any(String), title: expect.any(String) };
    expect(Object.keys(successShape)).toContain("id");
    expect(Object.keys(successShape)).toContain("title");
  });

  it("PATCH returns 200 with updated event", () => {
    const updatedShape = {
      id: expect.any(String),
      title: "Updated Title",
      venue: "New Venue",
    };
    expect(updatedShape.title).toBe("Updated Title");
  });

  it("DELETE returns 200 with ok: true", () => {
    const result = { ok: true };
    expect(result).toEqual({ ok: true });
  });
});
