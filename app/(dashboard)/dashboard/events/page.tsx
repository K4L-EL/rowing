import { GlassCard } from "@/components/glass-card";

export default function EventsStubPage() {
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight text-sky-950">Event booking</h1>
      <GlassCard className="p-8">
        <p className="text-muted-foreground">
          One-off event sign-ups will appear here in a future release.
        </p>
      </GlassCard>
    </div>
  );
}
