import type { ReportStatus } from "@prisma/client";

const LABELS: Record<ReportStatus, string> = {
  SUBMITTED: "Submitted",
  REVIEWED: "Reviewed",
  ASSIGNED: "Assigned",
  UNDER_DISCUSSION: "Under discussion",
  RESOLVED: "Resolved",
};

export function reportStatusLabel(status: ReportStatus): string {
  return LABELS[status] ?? status;
}
