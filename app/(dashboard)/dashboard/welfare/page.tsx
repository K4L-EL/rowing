import Link from "next/link";
import { auth } from "@/auth";
import { ClayCard } from "@/components/clay-card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { reportStatusLabel } from "@/lib/welfare-status";

export default async function WelfareListPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const reports = await prisma.welfareReport.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      createdAt: true,
      anonymousReporter: true,
    },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welfare</h1>
          <p className="text-sm text-muted-foreground">Open cases and new reports.</p>
        </div>
        <Link href="/dashboard/welfare/new" className={cn(buttonVariants(), "clay-button rounded-2xl")}>
          New report
        </Link>
      </div>
      {reports.length === 0 ? (
        <ClayCard className="p-8 text-center">
          <p className="text-muted-foreground">You have not submitted any welfare reports yet.</p>
          <Link href="/dashboard/welfare/new" className={cn(buttonVariants(), "clay-button mt-4 inline-flex rounded-2xl")}>
            File a report
          </Link>
        </ClayCard>
      ) : (
        <ul className="space-y-3">
          {reports.map((r) => (
            <li key={r.id}>
              <Link href={`/dashboard/welfare/${r.id}`}>
                <ClayCard className="flex flex-wrap items-center justify-between gap-3 p-4 transition-shadow hover:shadow-lg">
                  <div>
                    <p className="font-medium text-foreground">Case {r.id.slice(0, 8)}…</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleString()}
                      {r.anonymousReporter ? " · Anonymous reporter" : ""}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-clay-blue-light text-primary">
                    {reportStatusLabel(r.status)}
                  </Badge>
                </ClayCard>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
