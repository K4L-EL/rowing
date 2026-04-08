export type ReportStatus = "SUBMITTED" | "REVIEWED" | "ASSIGNED" | "UNDER_DISCUSSION" | "RESOLVED";

const LABELS: Record<ReportStatus, string> = {
  SUBMITTED: "Submitted",
  REVIEWED: "Reviewed",
  ASSIGNED: "Assigned",
  UNDER_DISCUSSION: "Under discussion",
  RESOLVED: "Resolved",
};

export function reportStatusLabel(status: string): string {
  return LABELS[status as ReportStatus] ?? status;
}
