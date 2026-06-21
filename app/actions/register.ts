"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createEmailService } from "@/lib/factories/email-service";
import crypto from "crypto";
import * as Sentry from "@sentry/nextjs";

const registerSchema = z.object({
  name: z.string().max(120).optional(),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  squad: z.string().min(1, "Squad is required"),
});

export type RegisterActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};

export async function registerAction(
  _prev: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> {
  const raw = {
    name: (formData.get("name") as string) || undefined,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    squad: formData.get("squad") as string,
  };
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  if (existing) {
    return { error: "An account with this email already exists." };
  }
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  try {
    await prisma.user.create({
      data: {
        email: parsed.data.email.toLowerCase(),
        name: parsed.data.name?.trim() || null,
        passwordHash,
        squad: parsed.data.squad.toUpperCase() as any,
      },
    });

    // Generate verification token and send email (fire-and-forget, don't block response)
    const token = crypto.randomUUID();
    try {
      await prisma.verificationToken.create({
        data: {
          identifier: parsed.data.email.toLowerCase(),
          token,
          expires: new Date(Date.now() + 86400000), // 24 hours
        },
      });

      const verifyLink = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/verify-email?token=${token}`;
      if (!process.env.RESEND_API_KEY) {
        console.log("[register] Email not configured. Verification link:", verifyLink);
      }
      const emailService = createEmailService({
        from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
        apiKey: process.env.RESEND_API_KEY,
      });
      void emailService.sendVerificationEmail(parsed.data.email.toLowerCase(), verifyLink);
    } catch {
      // Fire-and-forget — don't block registration if email fails
    }

    return { success: true };
  } catch (e) {
    console.error("[register] create failed", e);
    Sentry.captureException(e);
    return { error: "Registration failed. Please try again." };
  }
}
