import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AvailabilityCalendar } from "@/components/availability/availability-calendar";
import { nextFourteenDays, toIsoDate } from "@/lib/date-utils";

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
    select: { date: true, status: true },
  });

  const byDate: Record<string, "AVAILABLE" | "UNAVAILABLE" | "MAYBE"> = {};
  for (const s of slots) {
    byDate[toIsoDate(s.date)] = s.status;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Availability</h1>
        <p className="mt-1 text-muted-foreground">
          Tap each day to cycle through Available, Maybe, and Unavailable. Your coach sees
          this when building crews.
        </p>
      </div>
      <AvailabilityCalendar days={days.map(toIsoDate)} initial={byDate} />
    </div>
  );
}
