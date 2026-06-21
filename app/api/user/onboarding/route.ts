import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { onboardingComplete: true },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[user/onboarding] failed", e);
    return NextResponse.json({ error: "Failed to complete onboarding" }, { status: 500 });
  }
}
