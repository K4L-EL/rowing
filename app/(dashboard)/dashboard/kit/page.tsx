import { GlassCard } from "@/components/glass-card";

export default function KitStubPage() {
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight text-sky-950">Kit orders</h1>
      <GlassCard className="p-8">
        <p className="text-muted-foreground">
          Club kit ordering will be available here in a future update.
        </p>
      </GlassCard>
    </div>
  );
}
