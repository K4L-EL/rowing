"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Shirt, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ClayCard } from "@/components/clay-card";
import { Button } from "@/components/ui/button";

type KitItem = {
  id: string;
  name: string;
  price: number;
  description: string;
  color: string;
  badge?: string;
};

export function KitShopGrid() {
  const [items, setItems] = useState<KitItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/kit/items")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => toast.error("Failed to load kit items"))
      .finally(() => setLoading(false));
  }, []);

  async function addToBasket(item: KitItem) {
    try {
      const res = await fetch("/api/kit/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id, quantity: 1 }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`${item.name} added to basket`);
    } catch {
      toast.error("Could not add item. Please try again.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <Shirt className="size-12 text-muted-foreground/40" />
        <p className="text-muted-foreground">No kit items available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <ClayCard
          key={item.id}
          color={item.color as any}
          className="flex flex-col gap-3 p-5 transition-transform duration-300 hover:-translate-y-1"
        >
          <div className="relative">
            <div className="clay-sm flex aspect-square items-center justify-center bg-white/70">
              <Shirt className="size-14 text-primary" />
            </div>
            {item.badge && (
              <span className="clay-sm absolute right-2 top-2 bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                {item.badge}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground">{item.name}</h3>
            <p className="mt-1 text-xs leading-relaxed text-foreground/70 break-words">
              {item.description}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="shrink-0 text-lg font-black text-foreground">
              £{item.price}
            </span>
            <Button
              size="sm"
              onClick={() => addToBasket(item)}
              className="clay-button gap-1.5 rounded-xl"
            >
              <ShoppingBag className="size-3.5" />
              Add
            </Button>
          </div>
        </ClayCard>
      ))}
    </div>
  );
}
