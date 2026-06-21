import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockAuth } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
}));

const { mockCreateReport, mockSendReportSummary } = vi.hoisted(() => ({
  mockCreateReport: vi.fn(),
  mockSendReportSummary: vi.fn(),
}));

vi.mock("@/auth", () => ({ auth: mockAuth }));
vi.mock("@/lib/factories/welfare-repository", () => ({
  createWelfareRepository: vi.fn(() => ({
    createReport: mockCreateReport,
  })),
}));
vi.mock("@/lib/factories/email-service", () => ({
  createEmailService: vi.fn(() => ({
    sendReportSummary: mockSendReportSummary,
  })),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { submitWelfareReportAction } from "@/app/actions/welfare";

const validPayload = {
  anonymousReporter: false,
  relatedToSelf: true,
  reporterEmail: "reporter@test.com",
  subjectName: "John Doe",
  subjectSquad: "SENIOR",
  subjectRole: "Rower",
  factualDescription: "During training yesterday a member was treated poorly.",
  concernType: "BULLYING_HARASSMENT",
  whenDescription: "Yesterday at 10am",
  whereDescription: "Boathouse",
  ongoingOrOneOff: "ONE_OFF",
  allegedPersons: "",
  relationshipsToClub: "",
  witnesses: "",
  impactDescription: "Member feels anxious",
  immediateRisk: false,
  reportedElsewhere: "",
  actionsSoFar: "",
  evidenceDescription: "",
  consentToShare: true,
  needsMedicalAttention: false,
  needsSafeguardingAction: false,
  needsEmotionalSupport: false,
} as const;

describe("submitWelfareReportAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const result = await submitWelfareReportAction(validPayload as any);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("signed in");
    }
  });

  it("returns field errors for invalid payload", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });

    const result = await submitWelfareReportAction({} as any);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors).toBeDefined();
    }
  });

  it("creates report and returns ok with reportId on success", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockCreateReport.mockResolvedValue({ id: "report-123" });

    const result = await submitWelfareReportAction(validPayload as any);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.reportId).toBe("report-123");
    }
  });

  it("sends email summary on success", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockCreateReport.mockResolvedValue({ id: "report-123" });

    await submitWelfareReportAction(validPayload as any);
    expect(mockSendReportSummary).toHaveBeenCalledWith(
      "reporter@test.com",
      expect.any(Object),
    );
  });
});
