"use client";

import { ShoppingBag, Shirt } from "lucide-react";
import { toast } from "sonner";
import { ClayCard } from "@/components/clay-card";
import { Button } from "@/components/ui/button";
import { KIT_ITEMS } from "@/lib/constants/kit-items";

export function KitShopGrid() {
  function addToBasket(name: string) {
    toast.success(`${name} added to basket — checkout coming soon.`);
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {KIT_ITEMS.map((item) => (
        <ClayCard
          key={item.id}
          color={item.color}
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
            <p className="mt-1 text-xs leading-relaxed text-foreground/70">
              {item.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-black text-foreground">
              £{item.price}
            </span>
            <Button
              size="sm"
              onClick={() => addToBasket(item.name)}
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
