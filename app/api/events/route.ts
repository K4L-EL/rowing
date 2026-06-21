import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { serverHasPermission } from "@/lib/permissions";
import { createEventSchema } from "@/lib/validations/api";

export async function GET() {
  const events = await prisma.event.findMany({
    where: { date: { gte: new Date() } },
    orderBy: { date: "asc" },
  });
  return NextResponse.json(events);
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

  const parsed = createEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const event = await prisma.event.create({
    data: {
      title: parsed.data.title,
      date: new Date(parsed.data.date),
      venue: parsed.data.venue,
      description: parsed.data.description,
      price: parsed.data.price,
      time: parsed.data.time ?? "TBC",
      capacity: parsed.data.capacity ?? undefined,
      inviteOnly: parsed.data.inviteOnly ?? undefined,
      menu: parsed.data.menu ?? undefined,
    },
  });
  return NextResponse.json(event, { status: 201 });
}
