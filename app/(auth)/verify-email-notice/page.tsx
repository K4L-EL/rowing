import Link from "next/link";
import { ClayCard } from "@/components/clay-card";
import { Mail } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createEmailService } from "@/lib/factories/email-service";
import crypto from "crypto";

export default async function VerifyEmailNoticePage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const emailConfigured = !!process.env.RESEND_API_KEY;

  return (
    <div className="mx-auto mt-20 max-w-md">
      <ClayCard className="p-8 text-center">
        <Mail className="mx-auto size-12 text-primary" />
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-foreground">Verify your email</h1>
        {emailConfigured ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Check your email for the verification link. You need to verify your email before accessing the dashboard.
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            Email is not configured. Use the link below to verify your email.
          </p>
        )}

        <ResendForm email={session.user.email} emailConfigured={emailConfigured} />
      </ClayCard>
    </div>
  );
}

async function ResendForm({ email, emailConfigured }: { email: string; emailConfigured: boolean }) {
  const token = crypto.randomUUID();

  async function resend() {
    "use server";
    const t = crypto.randomUUID();
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: t,
        expires: new Date(Date.now() + 86400000), // 24 hours
      },
    });

    const verifyLink = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/verify-email?token=${t}`;
    const emailService = createEmailService({
      from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
      apiKey: process.env.RESEND_API_KEY,
    });
    await emailService.sendVerificationEmail(email, verifyLink);
  }

  const verifyLink = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/verify-email?token=${token}`;

  if (!emailConfigured) {
    // Create the token record immediately so the link works
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 86400000),
      },
    });
  }

  return (
    <div className="mt-6 space-y-4">
      {!emailConfigured && (
        <div className="rounded-xl bg-clay-blue-pale p-4 text-left">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Development verification link
          </p>
          <a
            href={verifyLink}
            className="break-all text-sm font-medium text-primary underline underline-offset-2 hover:text-primary/80"
          >
            {verifyLink}
          </a>
        </div>
      )}
      <form action={resend}>
        <button
          type="submit"
          className="clay-button rounded-2xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
        >
          Resend verification email
        </button>
      </form>
    </div>
  );
}
