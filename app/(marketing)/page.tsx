import Link from "next/link";
import {
  Heart,
  Shield,
  FileText,
  Bell,
  Users,
  ChevronRight,
  Zap,
  Lock,
  BarChart3,
  ArrowRight,
  CalendarDays,
} from "lucide-react";
import { ClayCard } from "@/components/clay-card";
import { WaveFieldLoader } from "@/components/three/wave-field-loader";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Heart,
    title: "Welfare first",
    body: "Structured multi-step reporting aligned with safeguarding best practice, so every concern is captured properly.",
    color: "bluePale" as const,
  },
  {
    icon: CalendarDays,
    title: "Availability & crew builder",
    body: "Members mark availability, coaches build boats and crew sheets in seconds. No more messy WhatsApp chats.",
    color: "white" as const,
  },
  {
    icon: Shield,
    title: "Confidential by design",
    body: "Information shared on a strict need-to-know basis, with consent captured at every step of the process.",
    color: "blueLight" as const,
  },
  {
    icon: FileText,
    title: "PDF & email copies",
    body: "Every report generates a downloadable PDF and an email copy with helpful resources and contact numbers.",
    color: "white" as const,
  },
  {
    icon: Bell,
    title: "Real-time status",
    body: "Track your case through submitted, reviewed, assigned, under-discussion, and resolved — with a full timeline.",
    color: "bluePale" as const,
  },
  {
    icon: Users,
    title: "Role-based access",
    body: "Members see their own reports. Welfare officers manage cases. Admins run the whole club.",
    color: "white" as const,
  },
  {
    icon: Lock,
    title: "Secure & hosted",
    body: "HTTPS everywhere, encrypted database, and deployed on enterprise-grade infrastructure. Your data is safe.",
    color: "white" as const,
  },
  {
    icon: Zap,
    title: "Everything in one place",
    body: "Kit orders, event booking, accounting, welfare, crew selection — one login, one beautiful portal.",
    color: "blueLight" as const,
  },
];

const steps = [
  {
    num: "01",
    title: "Set up your club",
    body: "Register and customise your portal in minutes. Your club's private space, ready to go.",
  },
  {
    num: "02",
    title: "Manage welfare",
    body: "File concerns, track cases, download reports — structured safeguarding built in.",
  },
  {
    num: "03",
    title: "Run your club",
    body: "Kit orders, event bookings, accounting — the day-to-day admin, all in one place.",
  },
  {
    num: "04",
    title: "Build your crew",
    body: "Member availability, crew selection, team management — ready for every outing.",
  },
];

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

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative px-5 pb-0 pt-20 md:pt-28">
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <ClayCard
            color="bluePale"
            className="mx-auto mb-8 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-foreground"
          >
            <Zap className="size-4 text-primary" />
            One portal. Every club function.
          </ClayCard>

          <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-foreground md:text-7xl">
            Everything your club needs,
            <br />
            <span className="bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-400 bg-clip-text text-transparent">
              beautifully simple.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Welfare, kit, events, accounting, availability and crew building —
            all in one modern portal, built for rowing clubs.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
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
                "clay-button rounded-2xl bg-white px-10 py-6 text-base font-semibold",
              )}
            >
              See how it works
            </Link>
          </div>
        </div>

        {/* Interactive 3D wave */}
        <div
          className="relative mt-12 overflow-hidden"
          style={{ height: "360px", width: "100vw", marginLeft: "calc(-50vw + 50%)" }}
        >
          <WaveFieldLoader />
        </div>
      </section>

      {/* Features */}
      <section className="bg-clay-blue-pale/25 px-5 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-4xl font-black tracking-tight md:text-5xl">
              Everything in one place
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Built for rowing clubs that want to run the whole show, not just
              safeguarding.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <ClayCard
                key={f.title}
                color={f.color}
                className="flex flex-col gap-3 p-6 transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="clay-sm inline-flex size-14 items-center justify-center bg-white/80">
                  <f.icon className="size-6 text-primary" />
                </span>
                <h3 className="text-lg font-bold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-foreground/70">
                  {f.body}
                </p>
              </ClayCard>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-4xl font-black tracking-tight md:text-5xl">
              How it works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From sign-up to a fully-run club in four simple steps.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <ClayCard
                key={s.num}
                color={i % 2 === 0 ? "white" : "bluePale"}
                className="p-7 text-center transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="clay-sm mx-auto mb-5 inline-flex size-16 items-center justify-center bg-primary text-2xl font-black text-primary-foreground">
                  {s.num}
                </span>
                <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </ClayCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-clay-blue-pale/25 px-5 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-4xl font-black tracking-tight md:text-5xl">
              Trusted by clubs
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Hear from welfare officers, coaches, and committee members.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <ClayCard
                key={t.name}
                color={t.color}
                className="flex flex-col gap-4 p-7"
              >
                <p className="flex-1 text-base leading-relaxed text-foreground/80 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <span className="clay-sm inline-flex size-11 items-center justify-center bg-primary font-bold text-primary-foreground">
                    {t.initials}
                  </span>
                  <div>
                    <p className="font-bold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </ClayCard>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-24 md:py-32">
        <div className="mx-auto max-w-3xl">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-black tracking-tight md:text-5xl">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((f) => (
              <ClayCard key={f.q} className="p-6">
                <h3 className="flex items-start gap-2 text-base font-bold text-foreground">
                  <ChevronRight className="mt-0.5 size-4 shrink-0 text-primary" />
                  {f.q}
                </h3>
                <p className="mt-2 pl-6 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              </ClayCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-24 md:py-32">
        <ClayCard
          color="blueLight"
          className="mx-auto max-w-4xl px-8 py-16 text-center md:px-16"
        >
          <h2 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">
            Ready to run your club better?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-foreground/70">
            Set up your club&apos;s portal in minutes. Welfare, kit, events,
            crew — everything included.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: "lg" }),
                "clay-button gap-2 rounded-2xl bg-white px-10 py-6 text-base font-semibold text-primary hover:bg-white/90",
              )}
            >
              Create your portal <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "clay-button rounded-2xl border-white/40 bg-white/30 px-10 py-6 text-base font-semibold text-foreground hover:bg-white/50",
              )}
            >
              Talk to us
            </Link>
          </div>
        </ClayCard>
      </section>

      {/* Stats strip */}
      <section className="border-t border-border bg-white/60 px-5 py-14">
        <div className="mx-auto grid max-w-4xl gap-8 text-center sm:grid-cols-3">
          {[
            { stat: "8+", label: "Club modules" },
            { stat: "9", label: "Welfare report sections" },
            { stat: "100%", label: "Free to start" },
          ].map((s) => (
            <div key={s.label}>
              <BarChart3 className="mx-auto mb-2 size-5 text-primary" />
              <p className="text-3xl font-black text-foreground">{s.stat}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
