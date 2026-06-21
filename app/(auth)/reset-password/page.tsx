"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ClayCard } from "@/components/clay-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { confirmResetAction } from "@/app/actions/reset-password";
import { Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setPending(true);
    const result = await confirmResetAction(token, password);
    setPending(false);

    if (result.ok) {
      setDone(true);
    } else {
      setError(result.error);
    }
  }

  if (!token) {
    return (
      <div className="mx-auto mt-20 max-w-md">
        <ClayCard className="p-8 text-center">
          <h1 className="text-xl font-semibold text-destructive">Invalid reset link</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This reset link is missing or invalid. Please request a new one.
          </p>
          <Link href="/forgot-password" className="mt-4 inline-block text-sm text-primary underline underline-offset-2">
            Request new link
          </Link>
        </ClayCard>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto mt-20 max-w-md">
        <ClayCard className="p-8 text-center">
          <CheckCircle2 className="mx-auto size-12 text-clay-mint" />
          <h1 className="mt-4 text-xl font-semibold tracking-tight text-foreground">Password changed</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your password has been reset successfully.
          </p>
          <Link href="/login" className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary underline underline-offset-2">
            Sign in with your new password
          </Link>
        </ClayCard>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-20 max-w-md">
      <ClayCard className="p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Set new password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your new password (at least 8 characters).
        </p>
        <form onSubmit={(e) => void onSubmit(e)} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="clay-pressed mt-1 rounded-xl border-0 bg-clay-blue-pale"
            />
          </div>
          <div>
            <Label htmlFor="confirm">Confirm new password</Label>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="clay-pressed mt-1 rounded-xl border-0 bg-clay-blue-pale"
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" className="clay-button w-full rounded-2xl" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : null}
            Reset password
          </Button>
        </form>
      </ClayCard>
    </div>
  );
}
