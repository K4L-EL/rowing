import Link from "next/link";
import { GlassCard } from "@/components/glass-card";
import { buttonVariants } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="flex flex-1 flex-col">
      <header className="border-b border-white/40 bg-white/30 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <span className="text-lg font-semibold tracking-tight text-sky-900">Rowing Club</span>
          <div className="flex gap-2">
            <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
              Sign in
            </Link>
            <Link href="/register" className={buttonVariants()}>
              Create account
            </Link>
          </div>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-10 px-4 py-16">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Your club, one calm place online
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            File welfare concerns safely, track progress on open cases, and access member services — starting
            with welfare, with more tools coming soon.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/register" className={buttonVariants({ size: "lg" })}>
              Get started
            </Link>
            <Link href="/login" className={buttonVariants({ size: "lg", variant: "outline" })}>
              Sign in
            </Link>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Welfare first",
              body: "Structured reporting aligned with safeguarding good practice, with clear status updates.",
            },
            {
              title: "Confidential by design",
              body: "Information shared only on a need-to-know basis, with consent captured in the flow.",
            },
            {
              title: "Growing with you",
              body: "Accounting, kit orders, and event booking will join the same portal over time.",
            },
          ].map((c) => (
            <GlassCard key={c.title} className="p-5">
              <h2 className="font-semibold text-sky-900">{c.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </main>
  );
}
