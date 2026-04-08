import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { ClayCard } from "@/components/clay-card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { parsePayload } from "@/lib/parse-payload";
import { reportStatusLabel } from "@/lib/welfare-status";
import { AiSummary } from "@/components/welfare/ai-summary";
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

  const parsed = welfarePayloadSchema.safeParse(parsePayload(report.payload));
  const payload = parsed.success ? parsed.data : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/dashboard/welfare" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "clay-button rounded-xl")}>
          ← All cases
        </Link>
      </div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Case detail</h1>
          <p className="font-mono text-xs text-muted-foreground">{report.id}</p>
        </div>
        <Badge className="bg-clay-blue-light text-primary">{reportStatusLabel(report.status)}</Badge>
      </div>

      <ClayCard className="space-y-4 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">Summary</h2>
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
        <Separator className="bg-border" />
        <div className="flex flex-wrap gap-2">
          <a
            href={`/api/welfare-reports/${report.id}/pdf`}
            download
            className={cn(buttonVariants({ variant: "secondary" }), "clay-button inline-flex rounded-2xl")}
          >
            Download PDF
          </a>
          <p className="w-full text-xs text-muted-foreground">
            A copy was also sent to your email on file when you submitted, if email is configured.
          </p>
        </div>
      </ClayCard>

      <AiSummary reportId={report.id} />

      <ClayCard className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">Progress</h2>
        <ul className="mt-4 space-y-3">
          {report.events.map((ev) => (
            <li key={ev.id} className="border-l-2 border-clay-blue pl-3 text-sm">
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
      </ClayCard>
    </div>
  );
}
