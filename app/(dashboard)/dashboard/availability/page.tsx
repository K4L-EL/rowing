import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AvailabilityCalendar } from "@/components/availability/availability-calendar";
import { nextFourteenDays, toIsoDate } from "@/lib/date-utils";
import { serverHasPermission } from "@/lib/permissions";

export default async function AvailabilityPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const days = nextFourteenDays();
  const start = days[0];
  const end = days[days.length - 1];

  const slots = await prisma.availabilitySlot.findMany({
    where: {
      userId: session.user.id,
      date: { gte: start, lte: end },
    },
    select: { date: true, session: true, status: true },
  });

  const bySession: Record<string, Record<string, "AVAILABLE" | "UNAVAILABLE" | "MAYBE">> = {};
  for (const s of slots) {
    const iso = toIsoDate(s.date);
    if (!bySession[iso]) bySession[iso] = {};
    bySession[iso][s.session] = s.status;
  }

  const isAdmin = serverHasPermission(session.user.role as any, "view:members");

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Availability</h1>
        <p className="mt-1 text-muted-foreground">
          Tap a day to see session slots. Mark yourself available, maybe, or unavailable
          for each session.
        </p>
      </div>
      <AvailabilityCalendar
        days={days.map(toIsoDate)}
        initial={bySession}
        isAdmin={isAdmin}
      />
    </div>
  );
}
