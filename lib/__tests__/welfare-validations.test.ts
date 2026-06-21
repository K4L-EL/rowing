import { describe, it, expect } from "vitest";
import {
  section1Schema,
  section2Schema,
  section3Schema,
  section4Schema,
  section5Schema,
  section6Schema,
  section7Schema,
  section8Schema,
  section9Schema,
  welfarePayloadSchema,
} from "@/lib/validations/welfare";

describe("section1Schema (Basic details)", () => {
  const valid = {
    anonymousReporter: false,
    relatedToSelf: true,
    reporterEmail: "test@example.com",
    subjectName: "John Doe",
    subjectSquad: "SENIOR",
    subjectRole: "Rower",
  };

  it("accepts valid input", () => {
    expect(section1Schema.safeParse(valid).success).toBe(true);
  });

  it("rejects missing subjectName", () => {
    const result = section1Schema.safeParse({ ...valid, subjectName: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = section1Schema.safeParse({ ...valid, reporterEmail: "not-an-email" });
    expect(result.success).toBe(false);
  });
});

describe("section2Schema (Nature of concern)", () => {
  const valid = {
    factualDescription: "Something happened during training today.",
    concernType: "SAFEGUARDING" as const,
  };

  it("accepts valid input", () => {
    expect(section2Schema.safeParse(valid).success).toBe(true);
  });

  it("accepts OTHER_WELFARE type (concernTypeOther is optional)", () => {
    const result = section2Schema.safeParse({
      factualDescription: "test test test test test",
      concernType: "OTHER_WELFARE",
    });
    expect(result.success).toBe(true);
  });

  it("accepts concernTypeOther when provided", () => {
    const result = section2Schema.safeParse({
      factualDescription: "test test test test test",
      concernType: "OTHER_WELFARE",
      concernTypeOther: "Some other issue",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short description", () => {
    const result = section2Schema.safeParse({
      factualDescription: "short",
      concernType: "BULLYING_HARASSMENT",
    });
    expect(result.success).toBe(false);
  });
});

describe("section3Schema (Time and location)", () => {
  const valid = {
    whenDescription: "Yesterday at 10am",
    whereDescription: "At the boathouse",
    ongoingOrOneOff: "ONE_OFF" as const,
  };

  it("accepts valid input", () => {
    expect(section3Schema.safeParse(valid).success).toBe(true);
  });

  it("accepts ONGOING", () => {
    const result = section3Schema.safeParse({ ...valid, ongoingOrOneOff: "ONGOING" });
    expect(result.success).toBe(true);
  });
});

describe("section4Schema (People involved)", () => {
  it("accepts empty fields (all optional)", () => {
    expect(section4Schema.safeParse({}).success).toBe(true);
  });

  it("accepts populated fields", () => {
    const result = section4Schema.safeParse({
      allegedPersons: "Coach Smith",
      relationshipsToClub: "Head coach",
      witnesses: "Jane and Bob",
    });
    expect(result.success).toBe(true);
  });
});

describe("section5Schema (Impact / risk)", () => {
  const valid = {
    impactDescription: "The member feels anxious about attending training.",
    immediateRisk: false,
  };

  it("accepts valid input", () => {
    expect(section5Schema.safeParse(valid).success).toBe(true);
  });

  it("rejects missing description", () => {
    const result = section5Schema.safeParse({ impactDescription: "", immediateRisk: false });
    expect(result.success).toBe(false);
  });
});

describe("section6Schema (Actions taken)", () => {
  it("accepts empty fields (all optional)", () => {
    expect(section6Schema.safeParse({}).success).toBe(true);
  });
});

describe("section7Schema (Supporting info)", () => {
  it("accepts empty fields (all optional)", () => {
    expect(section7Schema.safeParse({}).success).toBe(true);
  });
});

describe("section8Schema (Consent)", () => {
  it("accepts consent given", () => {
    expect(section8Schema.safeParse({ consentToShare: true }).success).toBe(true);
  });

  it("accepts consent withheld", () => {
    expect(section8Schema.safeParse({ consentToShare: false }).success).toBe(true);
  });
});

describe("section9Schema (Immediate needs)", () => {
  it("accepts valid input", () => {
    const result = section9Schema.safeParse({
      needsMedicalAttention: false,
      needsSafeguardingAction: false,
      needsEmotionalSupport: true,
    });
    expect(result.success).toBe(true);
  });
});

describe("welfarePayloadSchema (composite)", () => {
  const fullPayload = {
    anonymousReporter: false,
    relatedToSelf: true,
    reporterEmail: "officer@club.org",
    subjectName: "John Doe",
    subjectSquad: "SENIOR",
    subjectRole: "Rower",
    factualDescription: "During training yesterday a member was treated poorly.",
    concernType: "BULLYING_HARASSMENT",
    whenDescription: "Yesterday at 10am",
    whereDescription: "Boathouse",
    ongoingOrOneOff: "ONE_OFF",
    allegedPersons: "Coach",
    relationshipsToClub: "Head coach",
    witnesses: "Other rowers",
    impactDescription: "Member feels anxious",
    immediateRisk: false,
    reportedElsewhere: "",
    actionsSoFar: "",
    evidenceDescription: "",
    consentToShare: true,
    needsMedicalAttention: false,
    needsSafeguardingAction: false,
    needsEmotionalSupport: false,
  };

  it("validates a complete valid payload", () => {
    const result = welfarePayloadSchema.safeParse(fullPayload);
    expect(result.success).toBe(true);
  });

  it("rejects payload with missing required fields", () => {
    const result = welfarePayloadSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
