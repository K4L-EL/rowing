"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { createWelfareRepository } from "@/lib/factories/welfare-repository";
import { createEmailService } from "@/lib/factories/email-service";
import { prisma } from "@/lib/prisma";
import { welfarePayloadSchema, type WelfarePayload } from "@/lib/validations/welfare";

export type SubmitWelfareResult =
  | { ok: true; reportId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[] | undefined> };

export async function submitWelfareReportAction(payload: WelfarePayload): Promise<SubmitWelfareResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "You must be signed in to submit a report." };
  }
  const parsed = welfarePayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[] | undefined>,
    };
  }
  const repo = createWelfareRepository(prisma);
  const report = await repo.createReport({
    userId: session.user.id,
    anonymousReporter: parsed.data.anonymousReporter,
    payload: parsed.data,
  });
  const email = createEmailService({
    from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
    apiKey: process.env.RESEND_API_KEY,
  });
  void email.sendReportSummary(parsed.data.reporterEmail, parsed.data);
  revalidatePath("/dashboard/welfare");
  revalidatePath(`/dashboard/welfare/${report.id}`);
  return { ok: true, reportId: report.id };
}
