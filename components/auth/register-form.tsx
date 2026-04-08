"use client";

import { useActionState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClayCard } from "@/components/clay-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAction, type RegisterActionState } from "@/app/actions/register";

const initial: RegisterActionState = {};

export function RegisterForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(registerAction, initial);
  const signedInRef = useRef(false);

  useEffect(() => {
    if (!state.success || signedInRef.current) return;
    const form = document.querySelector<HTMLFormElement>("form[data-register]");
    if (!form) return;
    const fd = new FormData(form);
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;
    signedInRef.current = true;
    void (async () => {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.ok) router.replace("/dashboard/welfare");
      else signedInRef.current = false;
    })();
  }, [state.success, router]);

  return (
    <ClayCard className="p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Create account</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Use the same email you want copies of welfare reports sent to.
      </p>
      <form data-register action={formAction} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="name">Name (optional)</Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            className="clay-pressed mt-1 rounded-xl border-0 bg-clay-blue-pale"
          />
          {state.fieldErrors?.name?.[0] ? (
            <p className="mt-1 text-sm text-destructive">{state.fieldErrors.name[0]}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="clay-pressed mt-1 rounded-xl border-0 bg-clay-blue-pale"
          />
          {state.fieldErrors?.email?.[0] ? (
            <p className="mt-1 text-sm text-destructive">{state.fieldErrors.email[0]}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="clay-pressed mt-1 rounded-xl border-0 bg-clay-blue-pale"
          />
          {state.fieldErrors?.password?.[0] ? (
            <p className="mt-1 text-sm text-destructive">{state.fieldErrors.password[0]}</p>
          ) : null}
        </div>
        {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
        <Button type="submit" className="clay-button w-full rounded-2xl" disabled={pending || state.success}>
          {pending ? "Creating…" : state.success ? "Signing you in…" : "Register"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary underline">
          Sign in
        </Link>
      </p>
    </ClayCard>
  );
}
