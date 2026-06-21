import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { createNotification } from "@/lib/notifications";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  if (!checkRateLimit("book:" + session.user.id, 5, 60000)) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  // Check capacity
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      _count: { select: { bookings: { where: { status: "CONFIRMED" } } } },
    },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  if (event.capacity) {
    const existingBooking = await prisma.booking.findUnique({
      where: { eventId_userId: { eventId: id, userId: session.user.id } },
    });

    if (
      event._count.bookings >= event.capacity &&
      (!existingBooking || existingBooking.status !== "CONFIRMED")
    ) {
      return NextResponse.json(
        { error: "This event is fully booked" },
        { status: 409 },
      );
    }
  }

  const booking = await prisma.booking.upsert({
    where: { eventId_userId: { eventId: id, userId: session.user.id } },
    update: { status: "CONFIRMED" },
    create: { eventId: id, userId: session.user.id },
  });

  await createNotification(
    session.user.id,
    "booking_confirmed",
    `Booking confirmed for ${event.title}`,
    undefined,
    "/dashboard/events",
  );

  return NextResponse.json(booking);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  await prisma.booking.updateMany({
    where: { eventId: id, userId: session.user.id },
    data: { status: "CANCELLED" },
  });

  return NextResponse.json({ ok: true });
}
