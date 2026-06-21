import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { serverHasPermission } from "@/lib/permissions";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = serverHasPermission(session.user.role as any, "manage:system");

  const orders = await prisma.kitOrder.findMany({
    where: isAdmin ? undefined : { userId: session.user.id },
    include: {
      item: true,
      ...(isAdmin ? { user: { select: { id: true, name: true, email: true } } } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { itemId, quantity } = await req.json();
  if (!itemId) {
    return NextResponse.json({ error: "itemId is required" }, { status: 400 });
  }

  if (!checkRateLimit("order:" + session.user.id, 10, 60000)) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  const order = await prisma.kitOrder.create({
    data: {
      userId: session.user.id,
      itemId,
      quantity: quantity ?? 1,
    },
  });

  return NextResponse.json(order, { status: 201 });
}
