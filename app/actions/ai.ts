"use server";

import { auth } from "@/auth";
import { createAiService } from "@/lib/factories/ai-service";
import { prisma } from "@/lib/prisma";
import { parsePayload } from "@/lib/parse-payload";
import { welfarePayloadSchema } from "@/lib/validations/welfare";

const ai = createAiService({ apiKey: process.env.OPENAI_API_KEY });

export async function generateSummaryAction(
  reportId: string,
): Promise<{ ok: true; summary: string } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

  const report = await prisma.welfareReport.findFirst({
    where: { id: reportId, userId: session.user.id },
  });
  if (!report) return { ok: false, error: "Report not found" };

  const parsed = welfarePayloadSchema.safeParse(parsePayload(report.payload));
  if (!parsed.success) return { ok: false, error: "Invalid report data" };

  if (!process.env.OPENAI_API_KEY) return { ok: false, error: "AI is not configured yet." };

  const summary = await ai.generateReportSummary(parsed.data);
  return { ok: true, summary };
}

export async function assistWritingAction(
  fieldContext: string,
  userDraft: string,
): Promise<{ ok: true; suggestion: string } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

  if (!userDraft.trim()) return { ok: false, error: "Please write something first" };
  if (!process.env.OPENAI_API_KEY) return { ok: false, error: "AI is not configured yet." };

  const suggestion = await ai.assistWriting(fieldContext, userDraft);
  return { ok: true, suggestion };
}
