import { auth } from "@/auth";
import { renderWelfareReportPdf } from "@/lib/factories/pdf-service";
import { prisma } from "@/lib/prisma";
import { parsePayload } from "@/lib/parse-payload";
import { welfarePayloadSchema } from "@/lib/validations/welfare";
import { NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const isPrivileged =
    session.user.role === "ADMIN" || session.user.role === "WELFARE_OFFICER";
  const report = await prisma.welfareReport.findFirst({
    where: isPrivileged ? { id } : { id, userId: session.user.id },
  });
  if (!report) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const parsed = welfarePayloadSchema.safeParse(parsePayload(report.payload));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid stored payload" }, { status: 500 });
  }
  const buffer = await renderWelfareReportPdf(parsed.data, report.id);
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="welfare-report-${report.id}.pdf"`,
    },
  });
}
