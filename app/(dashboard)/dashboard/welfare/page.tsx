import Link from "next/link";
import { auth } from "@/auth";
import { GlassCard } from "@/components/glass-card";
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
          <h1 className="text-2xl font-semibold tracking-tight text-sky-950">Welfare</h1>
          <p className="text-sm text-muted-foreground">Open cases and new reports.</p>
        </div>
        <Link href="/dashboard/welfare/new" className={buttonVariants()}>
          New report
        </Link>
      </div>
      {reports.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <p className="text-muted-foreground">You have not submitted any welfare reports yet.</p>
          <Link href="/dashboard/welfare/new" className={cn(buttonVariants(), "mt-4 inline-flex")}>
            File a report
          </Link>
        </GlassCard>
      ) : (
        <ul className="space-y-3">
          {reports.map((r) => (
            <li key={r.id}>
              <Link href={`/dashboard/welfare/${r.id}`}>
                <GlassCard className="flex flex-wrap items-center justify-between gap-3 p-4 transition-colors hover:bg-white/60">
                  <div>
                    <p className="font-medium text-foreground">Case {r.id.slice(0, 8)}…</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleString()}
                      {r.anonymousReporter ? " · Anonymous reporter" : ""}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-sky-500/15 text-sky-900">
                    {reportStatusLabel(r.status)}
                  </Badge>
                </GlassCard>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
