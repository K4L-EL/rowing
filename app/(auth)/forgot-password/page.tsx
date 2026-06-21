"use client";

import { useState } from "react";
import { ClayCard } from "@/components/clay-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestResetAction } from "@/app/actions/reset-password";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const result = await requestResetAction(email);
    setPending(false);
    if (result.ok) {
      setSent(true);
    } else {
      setError(result.error);
    }
  }

  if (sent) {
    return (
      <div className="mx-auto mt-20 max-w-md">
        <ClayCard className="p-8 text-center">
          <CheckCircle2 className="mx-auto size-12 text-clay-mint" />
          <h1 className="mt-4 text-xl font-semibold tracking-tight text-foreground">Check your email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            If an account with that email exists, you'll receive a password reset link shortly.
          </p>
          <Link href="/login" className="mt-6 inline-flex items-center gap-1 text-sm text-primary underline underline-offset-2">
            <ArrowLeft className="size-3" />
            Back to sign in
          </Link>
        </ClayCard>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-20 max-w-md">
      <ClayCard className="p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Reset your password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your email and we'll send you a reset link.
        </p>
        <form onSubmit={(e) => void onSubmit(e)} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="clay-pressed mt-1 rounded-xl border-0 bg-clay-blue-pale"
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" className="clay-button w-full rounded-2xl" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : null}
            Send reset link
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-primary underline">
            Back to sign in
          </Link>
        </p>
      </ClayCard>
    </div>
  );
}
