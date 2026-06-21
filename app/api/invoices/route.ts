import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { serverHasPermission } from "@/lib/permissions";
import { createInvoiceSchema } from "@/lib/validations/api";
import { createNotification } from "@/lib/notifications";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = serverHasPermission(session.user.role as any, "manage:system");

  const invoices = await prisma.invoice.findMany({
    where: isAdmin ? undefined : { userId: session.user.id },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invoices);
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

  const parsed = createInvoiceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const invoice = await prisma.invoice.create({
    data: {
      userId: parsed.data.userId,
      title: parsed.data.title,
      amount: parsed.data.amount,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
      description: parsed.data.description ?? undefined,
    },
  });

  await createNotification(
    parsed.data.userId,
    "invoice_issued",
    `New invoice: ${parsed.data.title}`,
    `Amount: £${parsed.data.amount.toFixed(2)}`,
    "/dashboard/accounting",
  );

  return NextResponse.json(invoice, { status: 201 });
}
