"use server";

import { prisma } from "@/lib/prisma";
import { createEmailService } from "@/lib/factories/email-service";
import { requestResetSchema, confirmResetSchema } from "@/lib/validations/reset-password";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import * as Sentry from "@sentry/nextjs";

export async function requestResetAction(
  email: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = requestResetSchema.safeParse({ email });
  if (!parsed.success) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  // Always return ok to avoid revealing whether the email exists
  if (!user) {
    return { ok: true };
  }

  try {
    const token = crypto.randomUUID();
    await prisma.verificationToken.create({
      data: {
        identifier: user.email!,
        token,
        expires: new Date(Date.now() + 3600000), // 1 hour
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/reset-password?token=${token}`;

    const emailService = createEmailService({
      from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
      apiKey: process.env.RESEND_API_KEY,
    });

    void emailService.sendPasswordResetEmail(user.email!, resetLink);

    return { ok: true };
  } catch (e) {
    console.error("[reset] requestResetAction failed", e);
    Sentry.captureException(e);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export async function confirmResetAction(
  token: string,
  newPassword: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = confirmResetSchema.safeParse({ token, newPassword });
  if (!parsed.success) {
    return { ok: false, error: "Invalid token or password (min 8 characters)." };
  }

  try {
    const record = await prisma.verificationToken.findUnique({
      where: { token: parsed.data.token },
    });

    if (!record || record.expires < new Date()) {
      return { ok: false, error: "Invalid or expired reset link." };
    }

    const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);

    await prisma.user.update({
      where: { email: record.identifier },
      data: { passwordHash },
    });

    await prisma.verificationToken.delete({
      where: { token: parsed.data.token },
    });

    return { ok: true };
  } catch (e) {
    console.error("[reset] confirmResetAction failed", e);
    Sentry.captureException(e);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
