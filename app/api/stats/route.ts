import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [reportCount, memberCount] = await Promise.all([
      prisma.welfareReport.count(),
      prisma.user.count(),
    ]);

    return NextResponse.json({
      reportCount,
      memberCount,
      clubCount: 1,
    });
  } catch (e) {
    console.error("[stats] fetch failed", e);
    return NextResponse.json({ reportCount: 0, memberCount: 0, clubCount: 1 });
  }
}
