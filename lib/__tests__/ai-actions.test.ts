import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockAuth } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
}));

const { mockGenerateSummary, mockAssistWriting } = vi.hoisted(() => ({
  mockGenerateSummary: vi.fn(),
  mockAssistWriting: vi.fn(),
}));

const { mockPrismaFindFirst } = vi.hoisted(() => ({
  mockPrismaFindFirst: vi.fn(),
}));

vi.mock("@/auth", () => ({ auth: mockAuth }));
vi.mock("@/lib/factories/ai-service", () => ({
  createAiService: vi.fn(() => ({
    generateReportSummary: mockGenerateSummary,
    assistWriting: mockAssistWriting,
  })),
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    welfareReport: { findFirst: mockPrismaFindFirst },
  },
}));

import { generateSummaryAction, assistWritingAction } from "@/app/actions/ai";

const validPayload = {
  anonymousReporter: false,
  relatedToSelf: true,
  reporterName: "Reporter",
  reporterRole: "Member",
  reporterSquad: "SENIOR",
  reporterPhone: "",
  reporterEmail: "reporter@test.com",
  subjectName: "John",
  subjectSquad: "SENIOR",
  subjectRole: "Rower",
  factualDescription: "During training a member was treated poorly.",
  concernType: "SAFEGUARDING" as const,
  whenDescription: "yesterday",
  whereDescription: "boathouse",
  ongoingOrOneOff: "ONE_OFF" as const,
  allegedPersons: "",
  relationshipsToClub: "",
  witnesses: "",
  impactDescription: "Member feels anxious",
  immediateRisk: false,
  reportedElsewhere: "",
  actionsSoFar: "",
  evidenceDescription: "",
  evidenceFiles: [],
  previousConcernsSamePerson: "",
  consentToShare: true,
  immediateSupportNeeds: "",
  needsMedicalAttention: false,
  needsSafeguardingAction: false,
  needsEmotionalSupport: false,
};

describe("generateSummaryAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const result = await generateSummaryAction("report-1");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("Unauthorized");
    }
  });

  it("returns error when report not found", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockPrismaFindFirst.mockResolvedValue(null);

    const result = await generateSummaryAction("report-1");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("Report not found");
    }
  });

  it("returns error when AI not configured", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockPrismaFindFirst.mockResolvedValue({
      id: "report-1",
      userId: "user-1",
      payload: validPayload,
    });

    const result = await generateSummaryAction("report-1");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("AI is not configured");
    }
  });

  it("returns summary on success with mock AI", async () => {
    vi.stubEnv("AZURE_OPENAI_API_KEY", "test-key");
    vi.stubEnv("AZURE_OPENAI_ENDPOINT", "https://test.openai.azure.com");
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockPrismaFindFirst.mockResolvedValue({
      id: "report-1",
      userId: "user-1",
      payload: validPayload,
    });
    mockGenerateSummary.mockResolvedValue("Summary text");

    const result = await generateSummaryAction("report-1");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.summary).toBe("Summary text");
    }

    vi.unstubAllEnvs();
  });
});

describe("assistWritingAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error for empty draft", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });

    const result = await assistWritingAction("description", "");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("write something first");
    }
  });

  it("returns suggestion on success", async () => {
    vi.stubEnv("AZURE_OPENAI_API_KEY", "test-key");
    vi.stubEnv("AZURE_OPENAI_ENDPOINT", "https://test.openai.azure.com");
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockAssistWriting.mockResolvedValue("Suggested text");

    const result = await assistWritingAction("description", "some draft");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.suggestion).toBe("Suggested text");
    }

    vi.unstubAllEnvs();
  });
});
