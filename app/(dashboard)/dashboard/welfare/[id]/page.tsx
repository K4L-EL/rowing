import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { GlassCard } from "@/components/glass-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";
import { reportStatusLabel } from "@/lib/welfare-status";
import { welfarePayloadSchema } from "@/lib/validations/welfare";

type PageProps = { params: Promise<{ id: string }> };

export default async function WelfareDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) return null;
  const { id } = await params;

  const report = await prisma.welfareReport.findFirst({
    where: { id, userId: session.user.id },
    include: { events: { orderBy: { createdAt: "asc" } } },
  });
  if (!report) notFound();

  const parsed = welfarePayloadSchema.safeParse(report.payload);
  const payload = parsed.success ? parsed.data : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/dashboard/welfare" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          ← All cases
        </Link>
      </div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-sky-950">Case detail</h1>
          <p className="font-mono text-xs text-muted-foreground">{report.id}</p>
        </div>
        <Badge className="bg-sky-500/20 text-sky-950">{reportStatusLabel(report.status)}</Badge>
      </div>

      <GlassCard className="space-y-4 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-sky-800">Summary</h2>
        {payload ? (
          <dl className="grid gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Subject</dt>
              <dd className="font-medium">{payload.subjectName}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Concern type</dt>
              <dd className="font-medium">{payload.concernType.replace(/_/g, " ")}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Description</dt>
              <dd className="whitespace-pre-wrap">{payload.factualDescription}</dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-destructive">Could not read stored report data.</p>
        )}
        <Separator className="bg-white/40" />
        <div className="flex flex-wrap gap-2">
          <a
            href={`/api/welfare-reports/${report.id}/pdf`}
            download
            className={cn(buttonVariants({ variant: "secondary" }), "inline-flex")}
          >
            Download PDF
          </a>
          <p className="w-full text-xs text-muted-foreground">
            A copy was also sent to your email on file when you submitted, if email is configured.
          </p>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-sky-800">Progress</h2>
        <ul className="mt-4 space-y-3">
          {report.events.map((ev) => (
            <li key={ev.id} className="border-l-2 border-sky-400/60 pl-3 text-sm">
              <p className="font-medium">
                {ev.status ? reportStatusLabel(ev.status) : "Update"}
                <span className="ml-2 font-normal text-muted-foreground">
                  {new Date(ev.createdAt).toLocaleString()}
                </span>
              </p>
              {ev.note ? <p className="text-muted-foreground">{ev.note}</p> : null}
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}
