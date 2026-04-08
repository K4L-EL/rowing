import Link from "next/link";
import { ClayCard } from "@/components/clay-card";
import { Check, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "£0",
    period: "forever",
    description: "Everything you need to get started with welfare reporting.",
    color: "white" as const,
    featured: false,
    features: [
      "Unlimited welfare reports",
      "Multi-step guided form",
      "PDF downloads",
      "Email copy of reports",
      "Case status tracking",
      "Emergency contact modal",
      "1 club admin",
    ],
    cta: "Start free",
    href: "/register",
  },
  {
    name: "Club",
    price: "£19",
    period: "/month",
    description: "For clubs ready to go all-in on member management.",
    color: "blueLight" as const,
    featured: true,
    features: [
      "Everything in Free",
      "Unlimited welfare officers",
      "Accounting & billing module",
      "Kit ordering",
      "Event booking",
      "Priority email support",
      "Custom club branding",
    ],
    cta: "Coming soon",
    href: "/register",
  },
  {
    name: "Federation",
    price: "Custom",
    period: "",
    description: "For governing bodies managing multiple clubs.",
    color: "white" as const,
    featured: false,
    features: [
      "Everything in Club",
      "Multi-club dashboard",
      "Custom subdomain per club",
      "Centralised safeguarding view",
      "API access",
      "Dedicated account manager",
      "SLA & data processing agreement",
    ],
    cta: "Contact us",
    href: "/contact",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="px-5 pb-16 pt-14 md:pb-24 md:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Start with welfare for free. Upgrade when you&apos;re ready for the
            full suite of club management tools.
          </p>
        </div>
      </section>

      <section className="px-5 pb-20 md:pb-28">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <ClayCard
              key={plan.name}
              color={plan.color}
              className={cn(
                "flex flex-col p-6",
                plan.featured && "ring-2 ring-primary/30",
              )}
            >
              {plan.featured && (
                <span className="clay-sm mb-4 inline-flex self-start bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  Most popular
                </span>
              )}
              <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-foreground">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-sm text-muted-foreground">
                    {plan.period}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.description}
              </p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={cn(
                  buttonVariants({
                    variant: plan.featured ? "default" : "outline",
                  }),
                  "clay-button mt-6 gap-2 rounded-2xl",
                )}
              >
                {plan.cta} <ArrowRight className="size-4" />
              </Link>
            </ClayCard>
          ))}
        </div>
      </section>
    </>
  );
}
