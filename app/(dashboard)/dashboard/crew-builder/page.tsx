import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CrewBuilderWizard } from "@/components/availability/crew-builder-wizard";
import { nextFourteenDays, toIsoDate } from "@/lib/date-utils";
import { serverHasPermission } from "@/lib/permissions";

type PageProps = {
  searchParams: Promise<{ date?: string; squad?: string; session?: string }>;
};

export default async function CrewBuilderPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const canBuildCrews = serverHasPermission(session.user.role as any, "build:crews");

  const { date, squad: squadParam, session: sessionParam } = await searchParams;

  // Fetch all users grouped by squad
  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      squad: true,
      slackId: true,
    },
  });

  const members = users.map((u) => ({
    id: u.id,
    name: u.name || u.email || u.id,
    squad: u.squad as string | null,
    slackId: u.slackId,
  }));

  const dayOptions = nextFourteenDays().map(toIsoDate);
  const selectedDate = date
    ? new Date(date)
    : nextFourteenDays()[0];

  // Fetch availability for the selected squad + date across all 5 sessions
  // so the client can filter client-side when the session changes, without an extra API call.
  let availabilityMap: Record<string, "AVAILABLE" | "UNAVAILABLE" | "MAYBE"> = {};
  if (date && squadParam) {
    const dayStart = new Date(date);
    dayStart.setUTCHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

    const slots = await prisma.availabilitySlot.findMany({
      where: {
        user: { squad: squadParam as any },
        date: { gte: dayStart, lt: dayEnd },
      },
      select: { userId: true, session: true, status: true },
    });

    for (const slot of slots) {
      availabilityMap[`${slot.userId}:${slot.session}`] = slot.status;
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Crew builder</h1>
        <p className="mt-1 text-muted-foreground">
          {canBuildCrews
            ? "Build crews step by step — pick a squad, date, session, then assign boats."
            : "Coaches and admins can build crews here."}
        </p>
      </div>
      <CrewBuilderWizard
        members={members}
        dayOptions={dayOptions}
        initialDate={toIsoDate(selectedDate)}
        initialSquad={squadParam ?? null}
        canSave={canBuildCrews}
        availabilityMap={availabilityMap}
        sessionParam={sessionParam ?? null}
      />
    </div>
  );
}
