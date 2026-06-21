import Link from "next/link";
import { auth } from "@/auth";
import { ClayCard } from "@/components/clay-card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { reportStatusLabel } from "@/lib/welfare-status";
import { serverHasPermission } from "@/lib/permissions";
import { WelfarePagination } from "@/components/admin/welfare-pagination";

const PER_PAGE = 10;

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function WelfareListPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  const isPrivileged = serverHasPermission(session.user.role as any, "view:all-welfare");

  const where = isPrivileged ? undefined : { userId: session.user.id };

  const [totalReports, reports] = await Promise.all([
    prisma.welfareReport.count({ where }),
    prisma.welfareReport.findMany({
      where,
      take: PER_PAGE + 1,
      skip: (page - 1) * PER_PAGE,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        createdAt: true,
        anonymousReporter: true,
      },
    }),
  ]);

  const totalPages = Math.ceil(totalReports / PER_PAGE);
  const displayReports = reports.slice(0, PER_PAGE);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welfare</h1>
          <p className="text-sm text-muted-foreground">
            {totalReports} case{totalReports !== 1 ? "s" : ""}.
          </p>
        </div>
        <Link href="/dashboard/welfare/new" className={cn(buttonVariants(), "clay-button rounded-2xl")}>
          New report
        </Link>
      </div>
      {displayReports.length === 0 ? (
        <ClayCard className="p-8 text-center">
          <p className="text-muted-foreground">You have not submitted any welfare reports yet.</p>
          <Link href="/dashboard/welfare/new" className={cn(buttonVariants(), "clay-button mt-4 inline-flex rounded-2xl")}>
            File a report
          </Link>
        </ClayCard>
      ) : (
        <>
          <ul className="space-y-3">
            {displayReports.map((r) => (
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

          <WelfarePagination
            page={page}
            totalPages={totalPages}
            basePath="/dashboard/welfare"
          />
        </>
      )}
    </div>
  );
}
