import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CrewBuilder } from "@/components/availability/crew-builder";
import { nextFourteenDays, toIsoDate } from "@/lib/date-utils";

type PageProps = {
  searchParams: Promise<{ date?: string }>;
};

export default async function CrewBuilderPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const canBuildCrews =
    session.user.role === "ADMIN" || session.user.role === "WELFARE_OFFICER";

  const { date } = await searchParams;
  const selectedDate = date
    ? new Date(date)
    : nextFourteenDays()[0];
  selectedDate.setUTCHours(0, 0, 0, 0);

  const selectedIso = toIsoDate(selectedDate);
  const dayOptions = nextFourteenDays().map(toIsoDate);

  /* All users with availability for the selected date */
  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      squad: true,
      availability: {
        where: { date: selectedDate },
        select: { status: true },
        take: 1,
      },
    },
  });

  const members = users.map((u) => ({
    id: u.id,
    name: u.name || u.email || u.id,
    squad: u.squad,
    status: u.availability[0]?.status ?? null,
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Crew builder</h1>
        <p className="mt-1 text-muted-foreground">
          {canBuildCrews
            ? "See who's available and drop them into boat positions."
            : "Coaches and admins can build crews here."}
        </p>
      </div>
      <CrewBuilder
        members={members}
        selectedDate={selectedIso}
        dayOptions={dayOptions}
        canSave={canBuildCrews}
      />
    </div>
  );
}
