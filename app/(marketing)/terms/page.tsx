import type { Metadata } from "next";
import Link from "next/link";
import { ClayCard } from "@/components/clay-card";

export const metadata: Metadata = {
  title: "Terms of Service — RowSafe",
  description: "RowSafe terms of service. By using RowSafe you agree to these terms governing access to our platform.",
};

export default function TermsPage() {
  return (
    <>
      <section className="px-5 pb-16 pt-14 md:pb-24 md:pt-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Last updated: May 2026
          </p>
        </div>
      </section>

      <section className="px-5 pb-20 md:pb-28">
        <div className="mx-auto max-w-3xl space-y-6">
          <ClayCard className="p-6">
            <h2 className="text-xl font-bold">1. Acceptance</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              By creating an account or using RowSafe, you agree to these terms.
              If you are creating an account on behalf of a club, you represent
              that you have the authority to bind that club.
            </p>
          </ClayCard>

          <ClayCard className="p-6">
            <h2 className="text-xl font-bold">2. Account responsibility</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              You are responsible for keeping your login credentials secure and
              for all activity that occurs under your account. Notify us
              immediately if you suspect unauthorised access.
            </p>
          </ClayCard>

          <ClayCard className="p-6">
            <h2 className="text-xl font-bold">3. Acceptable use</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              RowSafe must be used in accordance with safeguarding best
              practices. Welfare reports must be submitted truthfully and in good
              faith. Abuse of the reporting system, harassment of other users, or
              use of the platform for unlawful purposes will result in account
              suspension.
            </p>
          </ClayCard>

          <ClayCard className="p-6">
            <h2 className="text-xl font-bold">4. Limitation of liability</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              RowSafe is provided &ldquo;as is&rdquo;. We make no guarantees
              about uninterrupted or error-free operation. We are not liable for
              any damages arising from the use or inability to use the platform,
              including but not limited to reliance on welfare report data, crew
              selections, or any other information stored in the system.
            </p>
          </ClayCard>

          <ClayCard className="p-6">
            <h2 className="text-xl font-bold">5. Termination</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              We reserve the right to suspend or terminate accounts that violate
              these terms. You may delete your account at any time through the
              dashboard or by contacting us.
            </p>
          </ClayCard>

          <ClayCard className="p-6">
            <h2 className="text-xl font-bold">6. Governing law</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              These terms are governed by the laws of England and Wales. Any
              disputes shall be resolved in the courts of England and Wales.
            </p>
          </ClayCard>

          <ClayCard className="p-6">
            <h2 className="text-xl font-bold">7. Contact</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Questions about these terms?{" "}
              <Link
                href="/contact"
                className="text-primary underline underline-offset-2 hover:text-primary/80"
              >
                Contact us
              </Link>
              .
            </p>
          </ClayCard>
        </div>
      </section>
    </>
  );
}
