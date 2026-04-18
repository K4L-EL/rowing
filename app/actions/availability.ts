"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { AvailabilityStatus } from "@prisma/client";

export async function setAvailabilityAction(
  date: string,
  status: AvailabilityStatus,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

  const day = new Date(date);
  if (Number.isNaN(day.getTime())) return { ok: false, error: "Invalid date" };
  day.setUTCHours(0, 0, 0, 0);

  try {
    await prisma.availabilitySlot.upsert({
      where: {
        userId_date: { userId: session.user.id, date: day },
      },
      update: { status },
      create: { userId: session.user.id, date: day, status },
    });
    revalidatePath("/dashboard/availability");
    revalidatePath("/dashboard/crew-builder");
    return { ok: true };
  } catch (e) {
    console.error("[availability] save failed", e);
    return { ok: false, error: "Save failed" };
  }
}

export async function saveCrewSheetAction(
  name: string,
  date: string,
  boatType: string,
  positions: Record<string, string | null>,
  note?: string,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "WELFARE_OFFICER")) {
    return { ok: false, error: "Only coaches and admins can save crew sheets" };
  }

  const day = new Date(date);
  if (Number.isNaN(day.getTime())) return { ok: false, error: "Invalid date" };

  try {
    const created = await prisma.crewSheet.create({
      data: {
        name,
        date: day,
        boatType,
        positions,
        note,
      },
    });
    revalidatePath("/dashboard/crew-builder");
    return { ok: true, id: created.id };
  } catch (e) {
    console.error("[crew] save failed", e);
    return { ok: false, error: "Save failed" };
  }
}
