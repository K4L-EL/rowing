"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClayCard } from "@/components/clay-card";
import { Button } from "@/components/ui/button";
import { Plus, Archive, Pencil, Loader2 } from "lucide-react";
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

type KitItem = {
  id: string;
  name: string;
  price: number;
  description: string;
  color: string;
  badge?: string | null;
};

export function AdminKitClient({ items: initial }: { items: KitItem[] }) {
  const [items, setItems] = useState(initial);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KitItem | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleArchive(id: string) {
    try {
      const res = await fetch(`/api/kit/items/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Item archived");
      router.refresh();
    } catch {
      toast.error("Failed to archive item");
    }
  }

  async function handleSaveDialog(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name") as string,
      price: Number(form.get("price")),
      description: form.get("description") as string,
    };

    try {
      let result: KitItem;

      if (editingItem) {
        const res = await fetch(`/api/kit/items/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Failed");
        result = await res.json();
        setItems((prev) => prev.map((i) => (i.id === result.id ? result : i)));
        toast.success("Item updated");
      } else {
        const res = await fetch("/api/kit/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Failed");
        result = await res.json();
        setItems((prev) => [...prev, result]);
        toast.success("Item created");
      }

      setDialogOpen(false);
      setEditingItem(null);
      router.refresh();
    } catch {
      toast.error(editingItem ? "Failed to update item" : "Failed to create item");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Kit shop
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage items in your club shop.
          </p>
        </div>

        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditingItem(null);
          }}
        >
          <DialogTrigger
            render={
              <Button className="clay-button rounded-xl">
                <Plus className="size-4" />
                Add new item
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit item" : "Add new item"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveDialog} className="space-y-4">
              <div>
                <Label htmlFor="item-name">Name</Label>
                <Input
                  id="item-name"
                  name="name"
                  defaultValue={editingItem?.name ?? ""}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="item-price">Price (&pound;)</Label>
                <Input
                  id="item-price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={editingItem?.price ?? ""}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="item-desc">Description</Label>
                <Textarea
                  id="item-desc"
                  name="description"
                  defaultValue={editingItem?.description ?? ""}
                  required
                  className="mt-1"
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
                  {editingItem ? "Save changes" : "Create item"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id}>
            <ClayCard className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-semibold text-foreground">
                  {item.name}
                  {item.badge && (
                    <span className="clay-sm ml-2 inline-block bg-primary px-2 py-0.5 text-[10px] uppercase tracking-wider text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">£{item.price}</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="clay-button rounded-xl"
                  onClick={() => {
                    setEditingItem(item);
                    setDialogOpen(true);
                  }}
                >
                  <Pencil className="size-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="clay-button rounded-xl"
                  onClick={() => handleArchive(item.id)}
                >
                  <Archive className="size-3" />
                </Button>
              </div>
            </ClayCard>
          </li>
        ))}
      </ul>
    </>
  );
}
