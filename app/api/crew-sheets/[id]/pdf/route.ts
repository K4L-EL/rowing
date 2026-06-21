import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { renderToBuffer } from "@react-pdf/renderer";
import { CrewSheetPdf } from "@/components/crew/crew-sheet-pdf";
import { NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const sheet = await prisma.crewSheet.findUnique({ where: { id } });

  if (!sheet) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const buffer = await renderToBuffer(
    CrewSheetPdf({
      document: {
        name: sheet.name,
        date: sheet.date.toISOString().split("T")[0],
        session: sheet.session,
        type: sheet.type,
        squad: sheet.squad ?? undefined,
        boatType: sheet.boatType ?? undefined,
        positions: sheet.positions as Record<string, string>[] | undefined,
        blades: sheet.blades ?? undefined,
        note: sheet.note ?? undefined,
      },
    }),
  );

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="crew-sheet-${id}.pdf"`,
    },
  });
}
