"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type User = { id: string; name: string | null; email: string | null };

export function AdminInvoiceDialog({ users }: { users: User[] }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const form = new FormData(e.currentTarget);
    const body = {
      userId: form.get("userId") as string,
      title: form.get("title") as string,
      amount: Number(form.get("amount")),
      dueDate: (form.get("dueDate") as string) || undefined,
      description: (form.get("description") as string) || undefined,
    };

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Invoice created");
      setDialogOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to create invoice");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => setDialogOpen(open)}
    >
      <DialogTrigger
        render={
          <Button className="clay-button rounded-xl">
            <Plus className="size-4" />
            New one-off invoice
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New one-off invoice</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="inv-user">Member</Label>
            <Select name="userId" required>
              <SelectTrigger id="inv-user" className="mt-1">
                <SelectValue placeholder="Select a member" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name ?? u.email ?? u.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="inv-title">Title</Label>
            <Input
              id="inv-title"
              name="title"
              placeholder="e.g. Regatta fee"
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="inv-amount">Amount (&pound;)</Label>
            <Input
              id="inv-amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="inv-due">Due date (optional)</Label>
            <Input id="inv-due" name="dueDate" type="date" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="inv-desc">Description (optional)</Label>
            <Textarea
              id="inv-desc"
              name="description"
              className="mt-1"
              rows={2}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              Create invoice
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
