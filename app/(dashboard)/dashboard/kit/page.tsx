import Link from "next/link";
import { KitShopGrid } from "@/components/kit/kit-shop-grid";

export default function KitShopPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Kit shop
          </h1>
          <p className="mt-1 text-muted-foreground">
            Official club kit, delivered to your door. Green &amp; pink
            colourway.
          </p>
        </div>
        <Link
          href="/dashboard/kit/orders"
          className="text-sm text-primary underline underline-offset-2 hover:text-primary/80"
        >
          View my orders
        </Link>
      </div>
      <KitShopGrid />
    </div>
  );
}
