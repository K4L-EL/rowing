"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { updateProfileSchema, changePasswordSchema } from "@/lib/validations/settings";
import * as Sentry from "@sentry/nextjs";

export async function updateProfileAction(
  data: { name?: string; squad?: string },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = updateProfileSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: "Invalid data" };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(parsed.data.name !== undefined ? { name: parsed.data.name } : {}),
        ...(parsed.data.squad !== undefined ? { squad: parsed.data.squad as any } : {}),
      },
    });
    revalidatePath("/dashboard/settings");
    return { ok: true };
  } catch (e) {
    console.error("[settings] updateProfileAction failed", e);
    Sentry.captureException(e);
    return { ok: false, error: "Update failed" };
  }
}

export async function changePasswordAction(
  currentPassword: string,
  newPassword: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = changePasswordSchema.safeParse({ currentPassword, newPassword });
  if (!parsed.success) {
    return { ok: false, error: "Invalid data" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { passwordHash: true },
    });

    if (!user?.passwordHash) {
      return { ok: false, error: "Account has no password set" };
    }

    const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
    if (!valid) {
      return { ok: false, error: "Current password is incorrect" };
    }

    const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash },
    });

    revalidatePath("/dashboard/settings");
    return { ok: true };
  } catch (e) {
    console.error("[settings] changePasswordAction failed", e);
    Sentry.captureException(e);
    return { ok: false, error: "Update failed" };
  }
}
