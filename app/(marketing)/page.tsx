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
    icon: Shield,
    title: "Confidential by design",
    body: "Information shared on a strict need-to-know basis, with consent captured at every step of the process.",
    color: "white" as const,
  },
  {
    icon: FileText,
    title: "PDF & email copies",
    body: "Every report generates a downloadable PDF and an email copy with helpful resources and contact numbers.",
    color: "blueLight" as const,
  },
  {
    icon: Bell,
    title: "Real-time status",
    body: "Track your case through submitted, reviewed, assigned, under-discussion, and resolved — with a full timeline.",
    color: "white" as const,
  },
  {
    icon: Users,
    title: "Role-based access",
    body: "Members see their own reports. Welfare officers manage cases. Everyone sees exactly what they need.",
    color: "bluePale" as const,
  },
  {
    icon: Lock,
    title: "Secure & hosted",
    body: "HTTPS everywhere, encrypted database, and deployed on enterprise-grade infrastructure. Your data is safe.",
    color: "white" as const,
  },
];

const steps = [
  {
    num: "01",
    title: "Create your account",
    body: "Register with your email in seconds. Your club portal is ready immediately.",
  },
  {
    num: "02",
    title: "File a welfare report",
    body: "Walk through 9 guided sections — from basic details to consent and immediate needs.",
  },
  {
    num: "03",
    title: "Track progress",
    body: "See real-time status updates and a full timeline for every case in your dashboard.",
  },
  {
    num: "04",
    title: "Download & share",
    body: "Get a PDF copy with helpful resources, or receive it by email automatically.",
  },
];

const testimonials = [
  {
    quote: "Finally, a welfare system that's actually easy to use. Our volunteers picked it up in minutes.",
    name: "Sarah M.",
    role: "Club Welfare Officer",
    color: "bluePale" as const,
  },
  {
    quote: "The anonymous reporting option gave our junior members the confidence to speak up when it mattered.",
    name: "James T.",
    role: "Head Coach",
    color: "white" as const,
  },
  {
    quote: "Having proper case tracking means nothing falls through the cracks. Game-changer for safeguarding.",
    name: "Dr. Priya K.",
    role: "Club Committee Chair",
    color: "blueLight" as const,
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
    q: "Will there be more features?",
    a: "Yes! Accounting, kit orders, and event booking are on the roadmap. Welfare is the foundation — more modules are coming.",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero with interactive 3D skyline */}
      <section className="relative px-5 pb-0 pt-16 md:pt-24">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <ClayCard
            color="bluePale"
            className="mx-auto mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground"
          >
            <Zap className="size-4 text-primary" />
            Safeguarding made simple
          </ClayCard>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl md:leading-tight">
            Your club&apos;s safe space,{" "}
            <span className="text-primary">online</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            File welfare concerns safely, track case progress, and access
            member services — all in one beautiful, easy-to-use portal built
            for rowing clubs.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: "lg" }),
                "clay-button gap-2 rounded-2xl px-8 text-base",
              )}
            >
              Start free <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/about"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "clay-button rounded-2xl bg-white px-8 text-base",
              )}
            >
              Learn more
            </Link>
          </div>
        </div>

        {/* Interactive 3D wave — move your mouse */}
        <div
          className="relative mt-10 overflow-hidden"
          style={{ height: "400px", width: "100vw", marginLeft: "calc(-50vw + 50%)" }}
        >
          <WaveFieldLoader />
        </div>
      </section>

      {/* Features */}
      <section className="bg-clay-blue-pale/40 px-5 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Everything your club needs
            </h2>
            <p className="mt-3 text-muted-foreground">
              Purpose-built for rowing clubs, with safeguarding at the core and
              more modules on the way.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <ClayCard
                key={f.title}
                color={f.color}
                className="flex flex-col gap-3 p-6"
              >
                <span className="clay-sm inline-flex size-11 items-center justify-center bg-white/60">
                  <f.icon className="size-5 text-primary" />
                </span>
                <h3 className="text-lg font-semibold text-foreground">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-foreground/70">
                  {f.body}
                </p>
              </ClayCard>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              How it works
            </h2>
            <p className="mt-3 text-muted-foreground">
              From account creation to case resolution in four simple steps.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <ClayCard
                key={s.num}
                color={i % 2 === 0 ? "white" : "bluePale"}
                className="p-6 text-center"
              >
                <span className="clay-sm mx-auto mb-4 inline-flex size-14 items-center justify-center bg-primary text-xl font-bold text-primary-foreground">
                  {s.num}
                </span>
                <h3 className="font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </ClayCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-clay-blue-pale/40 px-5 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Trusted by clubs
            </h2>
            <p className="mt-3 text-muted-foreground">
              Hear from welfare officers, coaches, and committee members.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <ClayCard
                key={t.name}
                color={t.color}
                className="flex flex-col gap-4 p-6"
              >
                <p className="flex-1 text-sm leading-relaxed text-foreground/80 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </ClayCard>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((f) => (
              <ClayCard key={f.q} className="p-6">
                <h3 className="flex items-start gap-2 font-semibold text-foreground">
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
      <section className="px-5 py-20 md:py-28">
        <ClayCard
          color="blueLight"
          className="mx-auto max-w-4xl px-8 py-14 text-center md:px-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Ready to make your club safer?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-foreground/70">
            Set up your club&apos;s welfare portal in minutes. Free to start, with
            more features coming soon.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: "lg" }),
                "clay-button gap-2 rounded-2xl bg-white px-8 text-base text-primary hover:bg-white/90",
              )}
            >
              Create your portal <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "clay-button rounded-2xl border-white/40 bg-white/30 px-8 text-base text-foreground hover:bg-white/50",
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
            { stat: "9", label: "Guided sections per report" },
            { stat: "5", label: "Case status stages" },
            { stat: "100%", label: "Free to start" },
          ].map((s) => (
            <div key={s.label}>
              <BarChart3 className="mx-auto mb-2 size-5 text-primary" />
              <p className="text-3xl font-bold text-foreground">{s.stat}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
