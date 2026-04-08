import type { PrismaClient, WelfareReport } from "@prisma/client";
import type { WelfarePayload } from "@/lib/validations/welfare";
import type { ReportStatus } from "@/lib/welfare-status";

export function createWelfareRepository(db: PrismaClient) {
  return {
    async createReport(input: {
      userId: string;
      anonymousReporter: boolean;
      payload: WelfarePayload;
    }): Promise<WelfareReport> {
      return db.welfareReport.create({
        data: {
          userId: input.userId,
          anonymousReporter: input.anonymousReporter,
          payload: JSON.stringify(input.payload),
          status: "SUBMITTED",
          events: {
            create: {
              status: "SUBMITTED",
              note: "Report submitted",
            },
          },
        },
      });
    },

    async listForUser(userId: string) {
      return db.welfareReport.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          status: true,
          anonymousReporter: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    },

    async getByIdForUser(reportId: string, userId: string) {
      return db.welfareReport.findFirst({
        where: { id: reportId, userId },
        include: {
          events: { orderBy: { createdAt: "asc" } },
        },
      });
    },

    async updateStatus(
      reportId: string,
      userId: string,
      status: ReportStatus,
      note?: string,
    ) {
      const report = await db.welfareReport.findFirst({
        where: { id: reportId, userId },
      });
      if (!report) return null;
      return db.$transaction(async (tx) => {
        const updated = await tx.welfareReport.update({
          where: { id: reportId },
          data: { status },
        });
        await tx.welfareReportEvent.create({
          data: {
            reportId,
            status,
            note: note ?? `Status updated to ${status}`,
          },
        });
        return updated;
      });
    },
  };
}

export type WelfareRepository = ReturnType<typeof createWelfareRepository>;
