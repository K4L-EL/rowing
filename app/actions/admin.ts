"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { serverHasPermission } from "@/lib/permissions";
import type { ReportStatus } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";
import { createNotification } from "@/lib/notifications";
import {
  buildStatusChangeNote,
  buildAssignNote,
} from "@/lib/action-logic/admin";

async function assertAdmin() {
  const session = await auth();
  if (!session?.user || !serverHasPermission(session.user.role as any, "manage:system")) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function updateReportStatusAction(
  reportId: string,
  status: ReportStatus,
  note?: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertAdmin();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.welfareReport.update({
        where: { id: reportId },
        data: { status },
      });
      await tx.welfareReportEvent.create({
        data: {
          reportId,
          status,
          note: buildStatusChangeNote(status, note),
        },
      });
    });

    // Notify the report owner
    const report = await prisma.welfareReport.findUnique({
      where: { id: reportId },
      select: { userId: true },
    });
    if (report) {
      await createNotification(
        report.userId,
        "welfare_status",
        `Case ${reportId.slice(0, 8)}… updated to ${status.replace(/_/g, " ").toLowerCase()}`,
        note ?? undefined,
        `/dashboard/welfare/${reportId}`,
      );
    }

    revalidatePath("/dashboard/admin/welfare");
    revalidatePath(`/dashboard/admin/welfare/${reportId}`);
    revalidatePath(`/dashboard/welfare/${reportId}`);
    return { ok: true };
  } catch (e) {
    console.error("[admin] status update failed", e);
    Sentry.captureException(e);
    return { ok: false, error: "Update failed" };
  }
}

export async function assignReportAction(
  reportId: string,
  assignedToId: string | null,
  notes?: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertAdmin();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  try {
    await prisma.welfareReport.update({
      where: { id: reportId },
      data: {
        assignedToId,
        adminNotes: notes,
      },
    });
    await prisma.welfareReportEvent.create({
      data: {
        reportId,
        note: buildAssignNote(assignedToId, notes),
      },
    });
    revalidatePath("/dashboard/admin/welfare");
    return { ok: true };
  } catch (e) {
    console.error("[admin] assign failed", e);
    Sentry.captureException(e);
    return { ok: false, error: "Assign failed" };
  }
}

export async function updateUserRoleAction(
  userId: string,
  role: "MEMBER" | "COACH" | "WELFARE_OFFICER" | "COMMITTEE" | "ADMIN",
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertAdmin();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });
    revalidatePath("/dashboard/admin/members");
    return { ok: true };
  } catch (e) {
    console.error("[admin] role update failed", e);
    Sentry.captureException(e);
    return { ok: false, error: "Update failed" };
  }
}
