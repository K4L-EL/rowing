import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { WelfareReportPdfDocument } from "@/components/pdf/welfare-report-pdf";
import type { WelfarePayload } from "@/lib/validations/welfare";

type PdfDocumentElement = Parameters<typeof renderToBuffer>[0];

export async function renderWelfareReportPdf(
  payload: WelfarePayload,
  referenceId: string,
): Promise<Buffer> {
  const element = React.createElement(WelfareReportPdfDocument, {
    payload,
    referenceId,
  }) as PdfDocumentElement;
  const buf = await renderToBuffer(element);
  return Buffer.from(buf);
}
