import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ClayCard } from "@/components/clay-card";
import { CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="mx-auto mt-20 max-w-md">
        <ClayCard className="p-8 text-center">
          <XCircle className="mx-auto size-12 text-destructive" />
          <h1 className="mt-4 text-xl font-semibold text-destructive">Invalid verification link</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This verification link is missing or invalid. Please try registering again.
          </p>
          <Link href="/login" className="mt-4 inline-block text-sm text-primary underline underline-offset-2">
            Sign in
          </Link>
        </ClayCard>
      </div>
    );
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!record || record.expires < new Date()) {
    return (
      <div className="mx-auto mt-20 max-w-md">
        <ClayCard className="p-8 text-center">
          <XCircle className="mx-auto size-12 text-destructive" />
          <h1 className="mt-4 text-xl font-semibold text-destructive">Invalid or expired link</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This verification link has expired or is invalid. Please try registering again.
          </p>
          <Link href="/login" className="mt-4 inline-block text-sm text-primary underline underline-offset-2">
            Sign in
          </Link>
        </ClayCard>
      </div>
    );
  }

  await prisma.user.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({
    where: { token },
  });

  return (
    <div className="mx-auto mt-20 max-w-md">
      <ClayCard className="p-8 text-center">
        <CheckCircle2 className="mx-auto size-12 text-clay-mint" />
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-foreground">Email verified</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your email has been verified. Please sign in again to continue.
        </p>
        <Link
          href="/login?verified=true"
          className="mt-6 inline-block clay-button rounded-2xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
        >
          Sign in
        </Link>
      </ClayCard>
    </div>
  );
}
