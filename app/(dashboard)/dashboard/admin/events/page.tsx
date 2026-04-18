import Link from "next/link";
import { ClayCard } from "@/components/clay-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { requireAdmin } from "@/lib/guards/admin";
import { Plus } from "lucide-react";

export default async function AdminEventsPage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/admin" className="text-sm text-muted-foreground hover:text-foreground">
          ← Admin
        </Link>
      </div>
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Events</h1>
        <p className="mt-1 text-muted-foreground">Create events, set ticket limits and invitations.</p>
      </div>

      <ClayCard className="p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Plus className="size-5 text-primary" />
          Create new event
        </h2>
        <form className="mt-5 space-y-4" action="#">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Event name</Label>
              <Input id="name" placeholder="e.g. Annual Dinner" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" className="mt-1" />
            </div>
          </div>
          <div>
            <Label htmlFor="venue">Venue</Label>
            <Input id="venue" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" rows={3} className="mt-1" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="price">Ticket price (£)</Label>
              <Input id="price" type="number" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="capacity">Ticket limit</Label>
              <Input id="capacity" type="number" placeholder="e.g. 120" className="mt-1" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="invite" />
            <Label htmlFor="invite">Invite-only (AGM, committee meetings, etc.)</Label>
          </div>
          <Button type="button" className="clay-button rounded-xl" disabled>
            Create event
          </Button>
          <p className="text-xs text-muted-foreground">
            Event creation persistence is coming soon.
          </p>
        </form>
      </ClayCard>
    </div>
  );
}
