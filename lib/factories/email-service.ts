import { Resend } from "resend";
import type { WelfarePayload } from "@/lib/validations/welfare";
import { HELPFUL_RESOURCES } from "@/lib/constants/helpful-resources";

export type EmailServiceConfig = {
  from: string;
  apiKey?: string;
};

function buildSummaryHtml(payload: WelfarePayload): string {
  const lines: string[] = [
    "<h2>Welfare report summary</h2>",
    "<p><strong>Subject of concern:</strong> " + escapeHtml(payload.subjectName) + "</p>",
    "<p><strong>Concern type:</strong> " + escapeHtml(payload.concernType) + "</p>",
    "<p><strong>What happened:</strong></p>",
    "<p>" + escapeHtml(payload.factualDescription).replace(/\n/g, "<br/>") + "</p>",
    "<hr/>",
    "<h3>Helpful contacts</h3>",
    "<ul>",
  ];
  for (const r of HELPFUL_RESOURCES) {
    lines.push(
      "<li><strong>" +
        escapeHtml(r.title) +
        "</strong>" +
        (r.phone ? " — " + escapeHtml(r.phone) : "") +
        (r.description ? "<br/><span>" + escapeHtml(r.description) + "</span>" : "") +
        (r.url ? "<br/><a href=\"" + escapeHtml(r.url) + "\">" + escapeHtml(r.url) + "</a>" : "") +
        "</li>",
    );
  }
  lines.push("</ul>");
  return lines.join("\n");
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function createEmailService(config: EmailServiceConfig) {
  const resend = config.apiKey ? new Resend(config.apiKey) : null;

  return {
    async sendReportSummary(to: string, payload: WelfarePayload): Promise<{ ok: boolean; error?: string }> {
      if (!resend) {
        console.warn("[email] RESEND_API_KEY not set; skipping send");
        return { ok: false, error: "Email not configured" };
      }
      const { error } = await resend.emails.send({
        from: config.from,
        to: [to],
        subject: "Copy of your welfare report — Rowing Club",
        html: buildSummaryHtml(payload),
      });
      if (error) {
        console.error("[email] Resend error", error);
        return { ok: false, error: error.message };
      }
      return { ok: true };
    },

    async sendPasswordResetEmail(to: string, link: string): Promise<{ ok: boolean; error?: string }> {
      if (!resend) {
        console.warn("[email] RESEND_API_KEY not set; skipping send");
        return { ok: false, error: "Email not configured" };
      }
      const { error } = await resend.emails.send({
        from: config.from,
        to: [to],
        subject: "Reset your password — Rowing Club",
        html: `<p>You requested a password reset.</p><p><a href="${escapeHtml(link)}" style="display:inline-block;padding:12px 24px;background:#0d9488;color:#fff;border-radius:12px;text-decoration:none;">Reset password</a></p><p>Or copy this link: ${escapeHtml(link)}</p><p>This link expires in 1 hour.</p>`,
      });
      if (error) {
        console.error("[email] Resend error", error);
        return { ok: false, error: error.message };
      }
      return { ok: true };
    },

    async sendVerificationEmail(to: string, link: string): Promise<{ ok: boolean; error?: string }> {
      if (!resend) {
        console.warn("[email] RESEND_API_KEY not set; skipping send");
        return { ok: false, error: "Email not configured" };
      }
      const { error } = await resend.emails.send({
        from: config.from,
        to: [to],
        subject: "Verify your email — Rowing Club",
        html: `<p>Welcome to RowSafe!</p><p>Please verify your email address by clicking the link below:</p><p><a href="${escapeHtml(link)}" style="display:inline-block;padding:12px 24px;background:#0d9488;color:#fff;border-radius:12px;text-decoration:none;">Verify email</a></p><p>Or copy this link: ${escapeHtml(link)}</p><p>This link expires in 24 hours.</p>`,
      });
      if (error) {
        console.error("[email] Resend error", error);
        return { ok: false, error: error.message };
      }
      return { ok: true };
    },
  };
}

export type EmailService = ReturnType<typeof createEmailService>;
