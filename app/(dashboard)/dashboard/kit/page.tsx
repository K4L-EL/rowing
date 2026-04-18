import { KitShopGrid } from "@/components/kit/kit-shop-grid";

export default function KitShopPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Kit shop</h1>
        <p className="mt-1 text-muted-foreground">
          Official club kit, delivered to your door. Green & pink colourway.
        </p>
      </div>
      <KitShopGrid />
    </div>
  );
}
