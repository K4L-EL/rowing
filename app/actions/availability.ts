"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { AvailabilityStatus, TrainingSession, SessionType } from "@prisma/client";
import { validateCrewSheetDate } from "@/lib/action-logic/availability";
import { serverHasPermission } from "@/lib/permissions";
import * as Sentry from "@sentry/nextjs";

export async function setAvailabilityAction(
  date: string,
  session: TrainingSession,
  status: AvailabilityStatus,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sessionUser = await auth();
  if (!sessionUser?.user?.id) return { ok: false, error: "Unauthorized" };

  const day = validateCrewSheetDate(date);
  if (!day) return { ok: false, error: "Invalid date" };

  try {
    await prisma.availabilitySlot.upsert({
      where: {
        userId_date_session: { userId: sessionUser.user.id, date: day, session },
      },
      update: { status },
      create: { userId: sessionUser.user.id, date: day, session, status },
    });
    revalidatePath("/dashboard/availability");
    revalidatePath("/dashboard/crew-builder");
    return { ok: true };
  } catch (e) {
    console.error("[availability] save failed", e);
    Sentry.captureException(e);
    return { ok: false, error: "Save failed" };
  }
}

export async function setSquadAvailabilityAction(
  squad: string,
  date: string,
  session: TrainingSession,
  status: AvailabilityStatus,
): Promise<{ ok: true; count: number } | { ok: false; error: string }> {
  const sessionUser = await auth();
  if (!sessionUser?.user || !serverHasPermission(sessionUser.user.role as any, "build:crews")) {
    return { ok: false, error: "Only coaches and admins can set squad availability" };
  }

  const day = validateCrewSheetDate(date);
  if (!day) return { ok: false, error: "Invalid date" };
  day.setUTCHours(0, 0, 0, 0);

  try {
    const members = await prisma.user.findMany({
      where: { squad: squad as any },
      select: { id: true },
    });

    for (const member of members) {
      await prisma.availabilitySlot.upsert({
        where: {
          userId_date_session: { userId: member.id, date: day, session },
        },
        update: { status },
        create: { userId: member.id, date: day, session, status },
      });
    }

    revalidatePath("/dashboard/availability");
    revalidatePath("/dashboard/crew-builder");
    return { ok: true, count: members.length };
  } catch (e) {
    console.error("[availability] squad set failed", e);
    Sentry.captureException(e);
    return { ok: false, error: "Save failed" };
  }
}

export async function saveCrewSheetAction(
  name: string,
  date: string,
  session: TrainingSession,
  type: SessionType,
  boatType?: string,
  positions?: Record<string, string | null>,
  squadron?: string,
  blades?: string[],
  note?: string,
  slackTs?: string,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const sessionUser = await auth();
  if (!sessionUser?.user || !serverHasPermission(sessionUser.user.role as any, "build:crews")) {
    return { ok: false, error: "Only coaches and admins can save crew sheets" };
  }

  const day = validateCrewSheetDate(date);
  if (!day) return { ok: false, error: "Invalid date" };

  // Duplicate seat assignment check
  if (positions) {
    const assigned = Object.values(positions).filter(Boolean);
    if (assigned.length !== new Set(assigned).size) {
      return { ok: false, error: "A member can only be assigned to one seat." };
    }
  }

  try {
    const created = await prisma.crewSheet.create({
      data: {
        name,
        date: day,
        session,
        type,
        boatType,
        positions: positions ?? undefined,
        squad: squadron ? (squadron as any) : undefined,
        blades: blades ?? [],
        note,
        slackTs,
      },
    });
    revalidatePath("/dashboard/crew-builder");
    return { ok: true, id: created.id };
  } catch (e) {
    console.error("[crew] save failed", e);
    Sentry.captureException(e);
    return { ok: false, error: "Save failed" };
  }
}
