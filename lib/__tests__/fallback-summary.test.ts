import { describe, it, expect } from "vitest";
import { fallbackSummary } from "@/lib/factories/ai-service";
import type { WelfarePayload } from "@/lib/validations/welfare";

describe("fallbackSummary", () => {
  const payload = {
    subjectName: "Test User",
    subjectSquad: "SENIOR",
    subjectRole: "ROWER",
    concernType: "WELLBEING_CONCERN",
    factualDescription: "Feeling anxious",
    whenDescription: "Yesterday",
    whereDescription: "Boathouse",
    immediateRisk: false,
    anonymousReporter: true,
  } as unknown as WelfarePayload;

  it("includes the subject name", () => {
    const result = fallbackSummary(payload);
    expect(result).toContain("Test User");
  });

  it("includes the squad", () => {
    const result = fallbackSummary(payload);
    expect(result).toContain("SENIOR");
  });

  it("replaces underscores in concern type with spaces", () => {
    const result = fallbackSummary(payload);
    expect(result).toContain("WELLBEING CONCERN");
  });

  it("reports immediate risk as No when false", () => {
    const result = fallbackSummary(payload);
    expect(result).toContain("No");
  });

  it("reports anonymous status", () => {
    const result = fallbackSummary(payload);
    expect(result).toContain("Yes");
  });

  it("reports immediate risk as Yes when true", () => {
    const risky = { ...payload, immediateRisk: true } as unknown as WelfarePayload;
    const result = fallbackSummary(risky);
    expect(result).toContain("Yes");
  });
});
