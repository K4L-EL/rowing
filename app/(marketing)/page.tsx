import type { Metadata } from "next";
import Link from "next/link";
import { type ReactNode } from "react";
import {
  ChevronRight,
  Zap,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "RowSafe — Welfare & Crew Management for Rowing Clubs",
  description:
    "Welfare reporting, crew management, and member portal purpose-built for rowing clubs. Safeguarding made simple.",
  openGraph: {
    title: "RowSafe — Welfare & Crew Management for Rowing Clubs",
    description:
      "Welfare reporting, crew management, and member portal purpose-built for rowing clubs.",
  },
};

import { ClayCard } from "@/components/clay-card";
import { WaveFieldLoader } from "@/components/three/wave-field-loader";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WizardDemo } from "@/components/marketing/wizard-demo";
import { RotatingTestimonials } from "@/components/marketing/rotating-testimonials";
import { LiveStats } from "@/components/marketing/live-stats";
import { BoatDemo } from "@/components/marketing/boat-demo";
import { GradientDivider } from "@/components/marketing/gradient-divider";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { RiverBackground } from "@/components/marketing/river-background";

const testimonials = [
  {
    quote: "Finally, a welfare system that's actually easy to use. Our volunteers picked it up in minutes.",
    name: "Sarah M.",
    role: "Club Welfare Officer",
    color: "bluePale" as const,
    initials: "SM",
  },
  {
    quote: "The availability and crew builder has completely replaced our WhatsApp group. Coaches love it.",
    name: "James T.",
    role: "Head Coach",
    color: "white" as const,
    initials: "JT",
  },
  {
    quote: "Having proper case tracking means nothing falls through the cracks. Game-changer for safeguarding.",
    name: "Dr. Priya K.",
    role: "Club Committee Chair",
    color: "blueLight" as const,
    initials: "PK",
  },
];

const faqs = [
  {
    q: "Can I report anonymously?",
    a: "Yes. You can choose to remain anonymous as the reporter. We still ask for an email so you can receive a copy and access your case in the portal.",
  },
  {
    q: "What happens if someone is in immediate danger?",
    a: "If you indicate immediate risk, a modal appears with emergency contact numbers (999, NSPCC, Childline, Samaritans) before you continue.",
  },
  {
    q: "Who can see my report?",
    a: "Only you and designated welfare officers. Members can only see their own reports, and data is shared strictly on a need-to-know basis.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. We use HTTPS, encrypted database connections, and deploy on enterprise-grade infrastructure. Passwords are hashed with bcrypt.",
  },
  {
    q: "What else does RowSafe do?",
    a: "Welfare, kit orders, event booking, accounting, availability tracking, and crew building — one portal for everything your club needs.",
  },
];

function FeatureItem({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <div className="border-b border-border pb-6 last:border-b-0 sm:last:border-b">
      <div className="mb-2">{icon}</div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="relative">
      <RiverBackground />
      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden px-5 pb-0 pt-20 md:pt-28">
        {/* Decorative background elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 size-96 rounded-full bg-gradient-to-br from-teal-600/5 to-emerald-400/5 blur-3xl" />
          <div className="absolute -right-32 bottom-0 size-96 rounded-full bg-gradient-to-br from-teal-600/5 to-transparent blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="flex flex-col gap-10 md:flex-row md:items-start">
            {/* Left column: headline + CTAs */}
            <div className="flex-1 text-left">
              <ClayCard
                color="bluePale"
                className="mb-8 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-foreground"
              >
                <Zap className="size-4 text-primary" />
                One portal. Every club function.
              </ClayCard>

              <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
                Everything your club needs,
                <br />
                <span className="bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent">
                  run with confidence.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                Welfare, kit, events, accounting, availability and crew building —
                all in one modern portal, built for rowing clubs.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "clay-button gap-2 rounded-2xl px-10 py-6 text-base font-semibold",
                  )}
                >
                  Get started free <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/about"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "clay-button rounded-2xl bg-card px-10 py-6 text-base font-semibold",
                  )}
                >
                  See how it works
                </Link>
              </div>
            </div>

            {/* Right column: interactive boat demo */}
            <div className="shrink-0 self-center md:self-start md:w-[45%]">
              <BoatDemo />
            </div>
          </div>
        </div>

        {/* Interactive 3D wave — full-bleed below */}
        <div
          className="relative mt-16 overflow-hidden"
          style={{ height: "360px", width: "100vw", marginLeft: "calc(-50vw + 50%)" }}
        >
          <WaveFieldLoader />
        </div>
      </section>

      {/* ==================== STATS STRIP ==================== */}
      <section className="border-t border-border bg-background/60 px-5 py-16">
        <div className="mx-auto max-w-5xl">
          <LiveStats />
        </div>
      </section>

      <GradientDivider />

      {/* ==================== WIZARD DEMO ==================== */}
      <section className="bg-clay-blue-pale/25 px-5 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          <WizardDemo />
        </div>
      </section>

      <GradientDivider />

      {/* ==================== FEATURES — STATIC TEXT GRID ==================== */}
      <section className="px-5 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2>Everything in one place</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Built for rowing clubs that want to run the whole show, not just
              safeguarding.
            </p>
          </div>

          <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureItem
              icon={<Zap className="size-4 text-primary" />}
              title="Welfare first"
              body="Structured multi-step reporting with PDF reports, email copies, and full timeline tracking for every concern."
            />
            <FeatureItem
              icon={<Zap className="size-4 text-primary" />}
              title="Availability & crew builder"
              body="Members mark availability per session, coaches build boats and crew sheets in seconds. No more WhatsApp chaos."
            />
            <FeatureItem
              icon={<Zap className="size-4 text-primary" />}
              title="Confidential by design"
              body="Information shared on a strict need-to-know basis, with consent captured at every step."
            />
            <FeatureItem
              icon={<Zap className="size-4 text-primary" />}
              title="PDF & email copies"
              body="Every report generates a downloadable PDF and an email with resources and contact numbers."
            />
            <FeatureItem
              icon={<Zap className="size-4 text-primary" />}
              title="Real-time status"
              body="Track your case through submitted, reviewed, assigned, and resolved — with a full timeline."
            />
            <FeatureItem
              icon={<Zap className="size-4 text-primary" />}
              title="Role-based access"
              body="Members see their own reports. Welfare officers manage cases. Coaches build crews. Admins run the club."
            />
            <FeatureItem
              icon={<Zap className="size-4 text-primary" />}
              title="Secure & hosted"
              body="HTTPS everywhere, encrypted database, deployed on enterprise-grade Azure infrastructure."
            />
            <FeatureItem
              icon={<Zap className="size-4 text-primary" />}
              title="Kit, events & accounting"
              body="Kit orders, event booking, accounting, welfare, crew selection — one login, one beautiful portal."
            />
          </div>
        </div>
      </section>

      <GradientDivider />

      {/* ==================== HOW IT WORKS — COMPACT TRIPTYCH ==================== */}
      <section className="px-5 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2>How it works</h2>
          </div>
          <ScrollReveal>
            <div className="grid gap-10 md:grid-cols-3 md:gap-16">
              <div className="text-center md:text-left">
                <span className="block select-none text-[5rem] font-black leading-[0.8] tracking-tight text-primary/[0.07] md:text-[7rem]">
                  01
                </span>
                <h3 className="mt-2 text-2xl font-bold">Set up your club</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Register and customise your portal in minutes. Your club gets a private
                  space with welfare forms, member directory, and all the tools.
                </p>
              </div>
              <div className="text-center md:text-left">
                <span className="block select-none text-[5rem] font-black leading-[0.8] tracking-tight text-primary/[0.07] md:text-[7rem]">
                  02
                </span>
                <h3 className="mt-2 text-2xl font-bold">Build your crew</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Members mark availability, coaches assign boats, every outing planned
                  in one place. No spreadsheets. No group chat chaos.
                </p>
              </div>
              <div className="text-center md:text-left">
                <span className="block select-none text-[5rem] font-black leading-[0.8] tracking-tight text-primary/[0.07] md:text-[7rem]">
                  03
                </span>
                <h3 className="mt-2 text-2xl font-bold">Sleep better</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Every concern tracked, every crew organised, every function managed.
                  RowSafe runs the operations so you can focus on the rowing.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <GradientDivider />

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="px-5 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal>
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2>Trusted by clubs</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Hear from welfare officers, coaches, and committee members.
              </p>
            </div>
            <RotatingTestimonials testimonials={testimonials} />
          </ScrollReveal>
        </div>
      </section>

      <GradientDivider />

      {/* ==================== FAQ ==================== */}
      <section className="bg-clay-blue-pale/25 px-5 py-24 md:py-32">
        <div className="mx-auto max-w-3xl">
          <ScrollReveal>
            <div className="mb-16 text-center">
              <h2>Frequently asked questions</h2>
            </div>
            <div className="space-y-3">
              {faqs.map((f) => (
                <details key={f.q} className="group">
                  <summary className="clay-sm flex cursor-pointer list-none items-start gap-3 bg-card p-5 transition-colors hover:bg-clay-blue-pale">
                    <ChevronRight className="mt-1 size-4 shrink-0 text-primary transition-transform group-open:rotate-90" />
                    <span className="text-base font-bold text-foreground">{f.q}</span>
                  </summary>
                  <div className="clay-pressed mx-2 mt-1 bg-card p-5">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {f.a}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ==================== CTA — FULL-BLEED ==================== */}
      <section className="bg-gradient-to-br from-teal-600 to-emerald-600 px-5 py-24 text-center md:py-32">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl">
            Ready to run your club better?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">
            Join clubs already using RowSafe. Set up your portal in minutes.
            Welfare, kit, events, crew — everything included.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-2xl bg-white px-10 py-6 text-base font-semibold text-teal-700 hover:bg-white/90",
              )}
            >
              Create your portal <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-2xl border-white/20 bg-white/10 px-10 py-6 text-base font-semibold text-white hover:bg-white/20",
              )}
            >
              Talk to us
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-border bg-background/60 px-5 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-3">
            <span className="clay-sm inline-flex size-9 items-center justify-center bg-primary text-sm font-bold text-primary-foreground">
              R
            </span>
            <span className="text-sm font-semibold text-foreground">RowSafe</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} RowSafe. Run with confidence.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
