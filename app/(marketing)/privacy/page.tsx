import type { Metadata } from "next";
import Link from "next/link";
import { ClayCard } from "@/components/clay-card";

export const metadata: Metadata = {
  title: "Privacy Policy — RowSafe",
  description: "RowSafe privacy policy. Learn how we collect, use, and protect your personal data.",
};

export default function PrivacyPage() {
  return (
    <>
      <section className="px-5 pb-16 pt-14 md:pb-24 md:pt-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Last updated: May 2026
          </p>
        </div>
      </section>

      <section className="px-5 pb-20 md:pb-28">
        <div className="mx-auto max-w-3xl space-y-6">
          <ClayCard className="p-6">
            <h2 className="text-xl font-bold">1. What data we collect</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              When you create an account, we collect your name, email address,
              squad affiliation, and role within the club. If you file a welfare
              report, we collect the information you provide during the reporting
              process, including the subject of the concern, details of the
              incident, and any supporting evidence. We also collect session
              availability data and crew selections made by coaches.
            </p>
          </ClayCard>

          <ClayCard className="p-6">
            <h2 className="text-xl font-bold">2. How we use your data</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Your data is used solely to operate the RowSafe platform: managing
              welfare reports, tracking availability, building crews, processing
              kit orders, and administering club events. Welfare reports are
              shared on a strict need-to-know basis with designated welfare
              officers and, where appropriate, coaches and committee members.
            </p>
          </ClayCard>

          <ClayCard className="p-6">
            <h2 className="text-xl font-bold">3. Data sharing</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              We do not sell your data. Welfare report data is shared only with
              authorised club personnel (welfare officers, coaches, committee
              members) based on their role and the consent given by the reporter.
              We may share aggregated, anonymised usage statistics publicly
              (e.g. &ldquo;X reports filed&rdquo;).
            </p>
          </ClayCard>

          <ClayCard className="p-6">
            <h2 className="text-xl font-bold">4. Your rights (GDPR)</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              You have the right to access, correct, or delete your personal data
              at any time. You can request a copy of your data or ask us to stop
              processing it by contacting us through our contact page. Welfare
              reports are retained in accordance with safeguarding best practice
              guidelines.
            </p>
          </ClayCard>

          <ClayCard className="p-6">
            <h2 className="text-xl font-bold">5. Data retention</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Account data is retained for as long as your account is active.
              Welfare report data is retained for the duration required by
              safeguarding regulations and club policy. You may request deletion
              of your account at any time, which will remove your personal data
              while preserving anonymised welfare records for safeguarding
              compliance.
            </p>
          </ClayCard>

          <ClayCard className="p-6">
            <h2 className="text-xl font-bold">6. Security</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              We use HTTPS encryption for all data in transit, encrypted database
              connections at rest, and deploy on enterprise-grade Azure
              infrastructure. Passwords are hashed using bcrypt. Access to
              welfare data is controlled by role-based permissions enforced at
              both the application and database level.
            </p>
          </ClayCard>

          <ClayCard className="p-6">
            <h2 className="text-xl font-bold">7. Contact</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              If you have questions about this privacy policy or how your data is
              handled, please{" "}
              <Link
                href="/contact"
                className="text-primary underline underline-offset-2 hover:text-primary/80"
              >
                get in touch
              </Link>
              .
            </p>
          </ClayCard>
        </div>
      </section>
    </>
  );
}
