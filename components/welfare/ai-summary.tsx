"use client";

import { useState } from "react";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClayCard } from "@/components/clay-card";
import { generateSummaryAction } from "@/app/actions/ai";
import { toast } from "sonner";

export function AiSummary({ reportId }: { reportId: string }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setLoading(true);
    const res = await generateSummaryAction(reportId);
    setLoading(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    setSummary(res.summary);
  }

  async function copyText() {
    if (!summary) return;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  }

  return (
    <ClayCard color="bluePale" className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
          <Sparkles className="size-4" />
          AI summary
        </h2>
        {summary && (
          <Button variant="ghost" size="sm" onClick={() => void copyText()} className="clay-button gap-1.5 rounded-xl text-xs">
            {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        )}
      </div>
      {!summary && !loading && (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            Generate an AI-powered summary of this report for your records or to share with relevant parties.
          </p>
          <Button
            onClick={() => void generate()}
            className="clay-button mt-3 gap-2 rounded-2xl"
            size="sm"
          >
            <Sparkles className="size-4" />
            Generate summary
          </Button>
        </div>
      )}
      {loading && (
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Generating summary…
        </div>
      )}
      {summary && (
        <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
          {summary}
        </div>
      )}
    </ClayCard>
  );
}
