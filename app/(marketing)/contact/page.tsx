"use client";

import { useState } from "react";
import { ClayCard } from "@/components/clay-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    toast.success("Message sent! We'll be in touch soon.");
  }

  return (
    <>
      <section className="px-5 pb-16 pt-14 md:pb-24 md:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Get in touch
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Questions about RowSafe, setting up your club, or partnership
            opportunities? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="px-5 pb-20 md:pb-28">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-5">
          <div className="space-y-5 md:col-span-2">
            <ClayCard color="bluePale" className="flex items-start gap-4 p-5">
              <span className="clay-sm inline-flex size-10 shrink-0 items-center justify-center bg-white/60">
                <Mail className="size-5 text-primary" />
              </span>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  hello@rowsafe.club
                </p>
              </div>
            </ClayCard>
            <ClayCard color="blueLight" className="flex items-start gap-4 p-5">
              <span className="clay-sm inline-flex size-10 shrink-0 items-center justify-center bg-white/60">
                <MapPin className="size-5 text-primary" />
              </span>
              <div>
                <h3 className="font-semibold">Location</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  United Kingdom
                </p>
              </div>
            </ClayCard>
          </div>

          <ClayCard className="p-6 md:col-span-3">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="clay-sm mb-4 inline-flex size-14 items-center justify-center bg-clay-blue-pale">
                  <Send className="size-6 text-primary" />
                </span>
                <h3 className="text-xl font-semibold">Thanks for reaching out!</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  We&apos;ll get back to you as soon as we can.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      required
                      className="clay-pressed mt-1 rounded-xl border-0 bg-clay-blue-pale"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      className="clay-pressed mt-1 rounded-xl border-0 bg-clay-blue-pale"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="club">Club name (optional)</Label>
                  <Input
                    id="club"
                    className="clay-pressed mt-1 rounded-xl border-0 bg-clay-blue-pale"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    rows={5}
                    required
                    className="clay-pressed mt-1 rounded-xl border-0 bg-clay-blue-pale"
                  />
                </div>
                <Button
                  type="submit"
                  className="clay-button w-full gap-2 rounded-2xl"
                >
                  Send message <Send className="size-4" />
                </Button>
              </form>
            )}
          </ClayCard>
        </div>
      </section>
    </>
  );
}
