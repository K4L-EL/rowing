import { describe, it, expect } from "vitest";
import { parsePayload } from "@/lib/parse-payload";

describe("parsePayload", () => {
  it("parses a JSON string to an object", () => {
    const result = parsePayload('{"key": "value"}');
    expect(result).toEqual({ key: "value" });
  });

  it("returns a non-JSON string as-is", () => {
    const result = parsePayload("just a string");
    expect(result).toBe("just a string");
  });

  it("returns an object unchanged", () => {
    const obj = { already: "parsed" };
    expect(parsePayload(obj)).toBe(obj);
  });

  it("returns null unchanged", () => {
    expect(parsePayload(null)).toBe(null);
  });

  it("returns a number unchanged", () => {
    expect(parsePayload(42)).toBe(42);
  });
});
