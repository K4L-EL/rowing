import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { WebClient } from "@slack/web-api";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slackToken = process.env.SLACK_BOT_TOKEN;
  const slackChannel = process.env.SLACK_CREW_CHANNEL;

  if (!slackToken || !slackChannel) {
    return NextResponse.json(
      { error: "Slack not configured. Set SLACK_BOT_TOKEN and SLACK_CREW_CHANNEL." },
      { status: 501 },
    );
  }

  try {
    const body = await req.json();
    const { name, squad, date, session, type, boatType, members, note } = body;

    const lines: string[] = [
      `*Crew Sheet: ${name}*`,
      `Squad: ${squad} | Date: ${date} | Session: ${session}`,
      `Type: ${type}${boatType ? ` | Boat: ${boatType}` : ""}`,
    ];

    if (members && Array.isArray(members) && members.length > 0) {
      lines.push("", "*Selected crew:*");
      for (const m of members) {
        const mention = m.slackId ? `<@${m.slackId}>` : m.name;
        lines.push(`  • ${mention}${m.position ? ` — ${m.position}` : ""}`);
      }
    }

    if (note) {
      lines.push("", `*Notes:* ${note}`);
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rowsafe.app";
    lines.push("");
    lines.push(`_View on RowSafe: ${appUrl}/dashboard/crew-builder_`);

    const client = new WebClient(slackToken);
    const result = await client.chat.postMessage({
      channel: slackChannel,
      text: lines.join("\n"),
      mrkdwn: true,
    });

    return NextResponse.json({
      ok: true,
      ts: result.ts,
    });
  } catch (e) {
    console.error("[slack] share-crew failed", e);
    return NextResponse.json({ error: "Failed to post to Slack" }, { status: 500 });
  }
}
