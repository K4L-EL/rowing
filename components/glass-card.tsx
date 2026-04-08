import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = HTMLAttributes<HTMLDivElement>;

export function GlassCard({ className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/60 bg-white/50 shadow-lg shadow-sky-500/10 backdrop-blur-xl dark:border-white/20 dark:bg-white/10",
        className,
      )}
      {...props}
    />
  );
}
