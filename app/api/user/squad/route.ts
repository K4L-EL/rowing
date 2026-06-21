import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { squad } = await req.json();
    if (!squad) {
      return NextResponse.json({ error: "Squad is required" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { squad: squad as any },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[user/squad] failed", e);
    return NextResponse.json({ error: "Failed to update squad" }, { status: 500 });
  }
}
