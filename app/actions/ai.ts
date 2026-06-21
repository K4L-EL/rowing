"use server";

import { auth } from "@/auth";
import { createAiService } from "@/lib/factories/ai-service";
import { prisma } from "@/lib/prisma";
import { parsePayload } from "@/lib/parse-payload";
import { welfarePayloadSchema } from "@/lib/validations/welfare";
import * as Sentry from "@sentry/nextjs";
import { checkRateLimit } from "@/lib/rate-limit";

const ai = createAiService({
  apiKey: process.env.AZURE_OPENAI_API_KEY ?? process.env.OPENAI_API_KEY,
  azureEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
  azureDeployment: process.env.AZURE_OPENAI_DEPLOYMENT ?? "gpt-4o-mini",
});

export async function generateSummaryAction(
  reportId: string,
): Promise<{ ok: true; summary: string } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

  const report = await prisma.welfareReport.findFirst({
    where: { id: reportId, userId: session.user.id },
  });
  if (!report) return { ok: false, error: "Report not found" };

  if (!checkRateLimit("ai:" + session.user.id, 3, 60000)) {
    return { ok: false, error: "Too many requests. Please wait before trying again." };
  }

  const parsed = welfarePayloadSchema.safeParse(parsePayload(report.payload));
  if (!parsed.success) return { ok: false, error: "Invalid report data" };

  if (!process.env.AZURE_OPENAI_API_KEY && !process.env.OPENAI_API_KEY) {
    return { ok: false, error: "AI is not configured yet." };
  }

  try {
    const summary = await ai.generateReportSummary(parsed.data);
    return { ok: true, summary };
  } catch (e) {
    console.error("[ai] generateSummaryAction failed", e);
    Sentry.captureException(e);
    return { ok: false, error: "AI generation failed. Please try again." };
  }
}

export async function assistWritingAction(
  fieldContext: string,
  userDraft: string,
): Promise<{ ok: true; suggestion: string } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

  if (!userDraft.trim()) return { ok: false, error: "Please write something first" };

  if (!checkRateLimit("ai:" + session.user.id, 3, 60000)) {
    return { ok: false, error: "Too many requests. Please wait before trying again." };
  }

  if (!process.env.AZURE_OPENAI_API_KEY && !process.env.OPENAI_API_KEY) {
    return { ok: false, error: "AI is not configured yet." };
  }

  try {
    const suggestion = await ai.assistWriting(fieldContext, userDraft);
    return { ok: true, suggestion };
  } catch (e) {
    console.error("[ai] assistWritingAction failed", e);
    Sentry.captureException(e);
    return { ok: false, error: "AI suggestion failed. Please try again." };
  }
}
