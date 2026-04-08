"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { assistWritingAction } from "@/app/actions/ai";
import { toast } from "sonner";

type AiAssistButtonProps = {
  fieldContext: string;
  getText: () => string;
  onSuggestion: (text: string) => void;
};

export function AiAssistButton({ fieldContext, getText, onSuggestion }: AiAssistButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    const draft = getText();
    if (!draft.trim()) {
      toast.info("Write something first, then let AI help improve it.");
      return;
    }
    setLoading(true);
    const res = await assistWritingAction(fieldContext, draft);
    setLoading(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    onSuggestion(res.suggestion);
    toast.success("AI suggestion applied — review and edit as needed.");
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => void handleClick()}
      disabled={loading}
      className="clay-button gap-1.5 rounded-xl text-xs text-primary"
    >
      {loading ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3" />}
      {loading ? "Thinking…" : "AI improve"}
    </Button>
  );
}
