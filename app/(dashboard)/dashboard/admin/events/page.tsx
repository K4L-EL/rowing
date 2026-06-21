import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/guards/permissions";
import { AdminEventsForm } from "./admin-events-form";
import { AdminEventsList } from "./admin-events-list";

export default async function AdminEventsPage() {
  await requirePermission("manage:system");

  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
    take: 20,
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/admin"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; Admin
        </Link>
      </div>
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          Events
        </h1>
        <p className="mt-1 text-muted-foreground">
          Create events, set ticket limits and invitations.
        </p>
      </div>
      <AdminEventsForm />
      <AdminEventsList
        events={events.map((e) => ({
          id: e.id,
          title: e.title,
          date: e.date,
          venue: e.venue,
          price: e.price,
        }))}
      />
    </div>
  );
}
