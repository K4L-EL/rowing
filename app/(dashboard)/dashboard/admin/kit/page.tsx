import Link from "next/link";
import { ClayCard } from "@/components/clay-card";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/guards/admin";
import { KIT_ITEMS } from "@/lib/constants/kit-items";
import { Plus, Archive, Pencil } from "lucide-react";

export default async function AdminKitPage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/admin" className="text-sm text-muted-foreground hover:text-foreground">
          ← Admin
        </Link>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Kit shop</h1>
          <p className="mt-1 text-muted-foreground">Manage items in your club shop.</p>
        </div>
        <Button className="clay-button rounded-xl" disabled>
          <Plus className="size-4" />
          Add new item
        </Button>
      </div>

      <ul className="space-y-3">
        {KIT_ITEMS.map((item) => (
          <li key={item.id}>
            <ClayCard className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-semibold text-foreground">
                  {item.name} {item.badge && <span className="clay-sm ml-2 inline-block bg-primary px-2 py-0.5 text-[10px] uppercase tracking-wider text-primary-foreground">{item.badge}</span>}
                </p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">£{item.price}</span>
                <Button size="sm" variant="outline" className="clay-button rounded-xl" disabled>
                  <Pencil className="size-3" />
                </Button>
                <Button size="sm" variant="outline" className="clay-button rounded-xl" disabled>
                  <Archive className="size-3" />
                </Button>
              </div>
            </ClayCard>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground">
        Item management persistence is coming soon — this list is currently driven by static mock data.
      </p>
    </div>
  );
}
