import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { serverHasPermission } from "@/lib/permissions";
import { createKitItemSchema } from "@/lib/validations/api";

export async function GET() {
  const items = await prisma.kitItem.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await auth();
  if (
    !session?.user ||
    !serverHasPermission(session.user.role as any, "manage:system")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();

  const parsed = createKitItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const item = await prisma.kitItem.create({ data: parsed.data });
  return NextResponse.json(item, { status: 201 });
}
