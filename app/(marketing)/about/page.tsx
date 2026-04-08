import { ClayCard } from "@/components/clay-card";
import { Heart, Lightbulb, ShieldCheck, Rocket } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Welfare at the core",
    body: "Every design decision starts with the question: does this make people safer? Safeguarding isn't an afterthought — it's the foundation.",
    color: "bluePale" as const,
  },
  {
    icon: Lightbulb,
    title: "Simple by default",
    body: "Club volunteers aren't IT professionals. Every screen is designed so anyone can use it, on any device, without training.",
    color: "white" as const,
  },
  {
    icon: ShieldCheck,
    title: "Privacy first",
    body: "Welfare data is sensitive. We encrypt everything, share on a strict need-to-know basis, and never sell your data.",
    color: "blueLight" as const,
  },
  {
    icon: Rocket,
    title: "Growing with clubs",
    body: "Welfare is just the start. Accounting, kit orders, event booking — each module is designed to work together seamlessly.",
    color: "white" as const,
  },
];

const timeline = [
  { year: "2026", title: "Welfare module", body: "Multi-step reporting, case tracking, PDF exports, and email copies." },
  { year: "Soon", title: "Accounting & bills", body: "Manage subscriptions, invoices, and payments in one place." },
  { year: "Soon", title: "Kit orders", body: "Club kit ordering with sizes, payments, and fulfilment tracking." },
  { year: "Later", title: "Event booking", body: "Regattas, socials, and training camps — sign up and pay online." },
  { year: "Later", title: "Multi-club platform", body: "Custom URLs for each club, with shared infrastructure and admin." },
];

export default function AboutPage() {
  return (
    <>
      <section className="px-5 pb-16 pt-14 md:pb-24 md:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Built for clubs, by people who care
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            RowSafe started with a simple question: why is it so hard for rowing
            clubs to handle welfare properly? The forms are paper, the
            follow-up is ad-hoc, and nothing is tracked. We&apos;re fixing that.
          </p>
        </div>
      </section>

      <section className="bg-clay-blue-pale/40 px-5 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">
            Our values
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {values.map((v) => (
              <ClayCard key={v.title} color={v.color} className="flex gap-4 p-6">
                <span className="clay-sm inline-flex size-11 shrink-0 items-center justify-center bg-white/60">
                  <v.icon className="size-5 text-primary" />
                </span>
                <div>
                  <h3 className="font-semibold text-foreground">{v.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/70">{v.body}</p>
                </div>
              </ClayCard>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">
            Roadmap
          </h2>
          <div className="space-y-4">
            {timeline.map((t) => (
              <ClayCard key={t.title} className="flex items-start gap-4 p-5">
                <span className="clay-sm inline-flex min-w-[56px] items-center justify-center bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  {t.year}
                </span>
                <div>
                  <h3 className="font-semibold text-foreground">{t.title}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{t.body}</p>
                </div>
              </ClayCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
