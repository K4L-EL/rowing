import OpenAI from "openai";
import type { WelfarePayload } from "@/lib/validations/welfare";

export type AiServiceConfig = {
  apiKey?: string;
  azureEndpoint?: string;
  azureDeployment?: string;
};

function createClient(config: AiServiceConfig): OpenAI | null {
  if (config.azureEndpoint && config.apiKey) {
    return new OpenAI({
      apiKey: config.apiKey,
      baseURL: `${config.azureEndpoint}/openai/deployments/${config.azureDeployment ?? "gpt-4o-mini"}`,
      defaultQuery: { "api-version": "2024-08-01-preview" },
      defaultHeaders: { "api-key": config.apiKey },
    });
  }
  if (config.apiKey) {
    return new OpenAI({ apiKey: config.apiKey });
  }
  return null;
}

export function createAiService(config: AiServiceConfig) {
  const client = createClient(config);

  return {
    async generateReportSummary(payload: WelfarePayload): Promise<string> {
      if (!client) return fallbackSummary(payload);
      try {
        const res = await client.chat.completions.create({
          model: config.azureDeployment ?? "gpt-4o-mini",
          temperature: 0.3,
          max_tokens: 600,
          messages: [
            {
              role: "system",
              content: `You are a safeguarding report assistant for a rowing club. Generate a clear, professional summary of the welfare concern below. Use bullet points. Be factual and neutral — do not add opinions or assumptions. Include: who reported, who it is about, what happened, when/where, risk level, and any immediate actions needed.`,
            },
            {
              role: "user",
              content: JSON.stringify(payload, null, 2),
            },
          ],
        });
        return res.choices[0]?.message?.content?.trim() ?? fallbackSummary(payload);
      } catch (e) {
        console.error("[ai] summary generation failed", e);
        return fallbackSummary(payload);
      }
    },

    async assistWriting(
      fieldContext: string,
      userDraft: string,
    ): Promise<string> {
      if (!client) return userDraft;
      try {
        const res = await client.chat.completions.create({
          model: config.azureDeployment ?? "gpt-4o-mini",
          temperature: 0.4,
          max_tokens: 300,
          messages: [
            {
              role: "system",
              content: `You help people file welfare reports for a rowing club. The user is writing the "${fieldContext}" section of their report. Help them express their concern clearly and factually. Keep the same tone and facts — just improve clarity, structure, and completeness. Return only the improved text, nothing else.`,
            },
            {
              role: "user",
              content: userDraft,
            },
          ],
        });
        return res.choices[0]?.message?.content?.trim() ?? userDraft;
      } catch (e) {
        console.error("[ai] assist failed", e);
        return userDraft;
      }
    },
  };
}

function fallbackSummary(p: WelfarePayload): string {
  return [
    `• Concern about: ${p.subjectName} (squad: ${p.subjectSquad}, role: ${p.subjectRole})`,
    `• Type: ${p.concernType.replace(/_/g, " ")}`,
    `• Description: ${p.factualDescription}`,
    `• When: ${p.whenDescription}`,
    `• Where: ${p.whereDescription}`,
    `• Immediate risk: ${p.immediateRisk ? "Yes" : "No"}`,
    `• Reporter anonymous: ${p.anonymousReporter ? "Yes" : "No"}`,
  ].join("\n");
}

export type AiService = ReturnType<typeof createAiService>;
