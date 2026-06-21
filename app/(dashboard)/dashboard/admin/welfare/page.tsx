import Link from "next/link";
import { ClayCard } from "@/components/clay-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/guards/permissions";
import { reportStatusLabel } from "@/lib/welfare-status";
import { AdminWelfareControls } from "@/components/admin/welfare-controls";
import { parsePayload } from "@/lib/parse-payload";
import { welfarePayloadSchema } from "@/lib/validations/welfare";
import { WelfarePagination } from "@/components/admin/welfare-pagination";
import { Search } from "lucide-react";

const PER_PAGE = 20;

type PageProps = {
  searchParams: Promise<{ status?: string; page?: string; q?: string }>;
};

export default async function AdminWelfarePage({ searchParams }: PageProps) {
  await requirePermission("manage:welfare");
  const sp = await searchParams;
  const statusFilter = sp.status;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const query = sp.q?.trim() ?? "";

  const statusWhere =
    statusFilter && statusFilter !== "ALL"
      ? { status: statusFilter as never }
      : undefined;

  const searchWhere = query
    ? {
        OR: [
          { payload: { path: ["subjectName"], string_contains: query } },
          { payload: { path: ["factualDescription"], string_contains: query } },
        ],
      }
    : undefined;

  const where = {
    ...(statusWhere ?? {}),
    ...(searchWhere ?? {}),
  } as any;

  const [totalReports, reports] = await Promise.all([
    prisma.welfareReport.count({ where }),
    prisma.welfareReport.findMany({
      where,
      take: PER_PAGE + 1,
      skip: (page - 1) * PER_PAGE,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, email: true, name: true } },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalReports / PER_PAGE);
  const hasNext = reports.length > PER_PAGE;
  const displayReports = reports.slice(0, PER_PAGE);

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
        <p className="mt-1 text-muted-foreground">{totalReports} total reports.</p>
      </div>

      <form method="GET" action="/dashboard/admin/welfare" className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="q"
          placeholder="Search by subject name or description..."
          defaultValue={query}
          className="clay-pressed rounded-xl border-0 bg-clay-blue-pale pl-10"
        />
        {statusFilter && statusFilter !== "ALL" && (
          <input type="hidden" name="status" value={statusFilter} />
        )}
      </form>

      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <Link
            key={s}
            href={
              s === "ALL"
                ? `/dashboard/admin/welfare${query ? `?q=${query}` : ""}`
                : `/dashboard/admin/welfare?status=${s}${query ? `&q=${query}` : ""}`
            }
            className={`clay-sm px-3 py-1.5 text-xs font-semibold ${
              (statusFilter ?? "ALL") === s
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {s === "ALL" ? "All" : reportStatusLabel(s as never)}
          </Link>
        ))}
      </div>

      {displayReports.length === 0 ? (
        <ClayCard className="p-8 text-center text-muted-foreground">
          {query ? "No reports match your search." : "No reports match this filter."}
        </ClayCard>
      ) : (
        <>
          <ul className="space-y-3">
            {displayReports.map((r) => {
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

          <WelfarePagination
            page={page}
            totalPages={totalPages}
            basePath="/dashboard/admin/welfare"
            searchParams={Object.fromEntries(
              Object.entries({ status: statusFilter, q: query }).filter(
                ([_, v]) => v && v !== "ALL",
              ) as [string, string][],
            )}
          />
        </>
      )}
    </div>
  );
}
