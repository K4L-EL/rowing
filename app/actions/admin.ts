"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { ReportStatus } from "@prisma/client";

async function assertAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
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
          note: note?.trim() || `Status updated to ${status}`,
        },
      });
    });
    revalidatePath("/dashboard/admin/welfare");
    revalidatePath(`/dashboard/admin/welfare/${reportId}`);
    revalidatePath(`/dashboard/welfare/${reportId}`);
    return { ok: true };
  } catch (e) {
    console.error("[admin] status update failed", e);
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
        note: assignedToId
          ? `Assigned to user ${assignedToId}${notes ? ` — ${notes}` : ""}`
          : "Unassigned",
      },
    });
    revalidatePath("/dashboard/admin/welfare");
    return { ok: true };
  } catch (e) {
    console.error("[admin] assign failed", e);
    return { ok: false, error: "Assign failed" };
  }
}

export async function updateUserRoleAction(
  userId: string,
  role: "USER" | "WELFARE_OFFICER" | "ADMIN",
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
    return { ok: false, error: "Update failed" };
  }
}
