import Link from "next/link";
import { ClayCard } from "@/components/clay-card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards/admin";
import { reportStatusLabel } from "@/lib/welfare-status";
import { AdminWelfareControls } from "@/components/admin/welfare-controls";
import { parsePayload } from "@/lib/parse-payload";
import { welfarePayloadSchema } from "@/lib/validations/welfare";

type PageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminWelfarePage({ searchParams }: PageProps) {
  await requireAdmin();
  const { status } = await searchParams;

  const reports = await prisma.welfareReport.findMany({
    where: status && status !== "ALL" ? { status: status as never } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, email: true, name: true } },
    },
  });

  const statuses = ["ALL", "SUBMITTED", "REVIEWED", "ASSIGNED", "UNDER_DISCUSSION", "RESOLVED"];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/admin" className="text-sm text-muted-foreground hover:text-foreground">
          ← Admin
        </Link>
      </div>
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Welfare cases</h1>
        <p className="mt-1 text-muted-foreground">All {reports.length} reports across the club.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <Link
            key={s}
            href={s === "ALL" ? "/dashboard/admin/welfare" : `/dashboard/admin/welfare?status=${s}`}
            className={`clay-sm px-3 py-1.5 text-xs font-semibold ${
              (status ?? "ALL") === s
                ? "bg-primary text-primary-foreground"
                : "bg-white text-muted-foreground hover:text-foreground"
            }`}
          >
            {s === "ALL" ? "All" : reportStatusLabel(s as never)}
          </Link>
        ))}
      </div>

      {reports.length === 0 ? (
        <ClayCard className="p-8 text-center text-muted-foreground">
          No reports match this filter.
        </ClayCard>
      ) : (
        <ul className="space-y-3">
          {reports.map((r) => {
            const parsed = welfarePayloadSchema.safeParse(parsePayload(r.payload));
            const payload = parsed.success ? parsed.data : null;
            return (
              <li key={r.id}>
                <ClayCard className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">
                        Case {r.id.slice(0, 8)}…
                        {payload && (
                          <span className="ml-2 font-normal text-muted-foreground">
                            ({payload.concernType.replace(/_/g, " ")})
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        By{" "}
                        {r.anonymousReporter
                          ? "Anonymous"
                          : r.user.name || r.user.email || r.user.id}{" "}
                        · {new Date(r.createdAt).toLocaleString()}
                      </p>
                      {payload && (
                        <p className="mt-1 text-sm text-foreground/80">
                          Subject: <strong>{payload.subjectName}</strong>{" "}
                          ({payload.subjectSquad}, {payload.subjectRole})
                        </p>
                      )}
                    </div>
                    <Badge className="bg-clay-blue-light text-primary">
                      {reportStatusLabel(r.status)}
                    </Badge>
                  </div>
                  <AdminWelfareControls
                    reportId={r.id}
                    currentStatus={r.status}
                    currentNotes={r.adminNotes ?? ""}
                  />
                  <div className="mt-3">
                    <Link
                      href={`/dashboard/welfare/${r.id}`}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      View full report →
                    </Link>
                  </div>
                </ClayCard>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
