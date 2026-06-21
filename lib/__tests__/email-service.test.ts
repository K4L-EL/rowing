import { describe, it, expect } from "vitest";
import { escapeHtml } from "@/lib/factories/email-service";

describe("escapeHtml", () => {
  it("escapes ampersands", () => {
    expect(escapeHtml("&")).toBe("&amp;");
  });

  it("escapes less-than", () => {
    expect(escapeHtml("<")).toBe("&lt;");
  });

  it("escapes greater-than", () => {
    expect(escapeHtml(">")).toBe("&gt;");
  });

  it("escapes double quotes", () => {
    expect(escapeHtml('"')).toBe("&quot;");
  });

  it("escapes all special characters together", () => {
    expect(escapeHtml('&<>"')).toBe("&amp;&lt;&gt;&quot;");
  });

  it("leaves safe text unchanged", () => {
    expect(escapeHtml("hello world")).toBe("hello world");
  });

  it("handles empty strings", () => {
    expect(escapeHtml("")).toBe("");
  });
});
