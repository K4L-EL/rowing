import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ClayCard } from "@/components/clay-card";
import { Package, ChevronRight } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Processing",
  CONFIRMED: "Confirmed",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-clay-blue-pale text-foreground",
  CONFIRMED: "bg-clay-mint text-primary",
  DELIVERED: "bg-clay-mint text-primary",
  CANCELLED: "bg-destructive/10 text-destructive",
};

export default async function KitOrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const orders = await prisma.kitOrder.findMany({
    where: { userId: session.user.id },
    include: { item: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/kit"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; Kit shop
        </Link>
      </div>
      <h1 className="text-3xl font-black tracking-tight text-foreground">
        My orders
      </h1>

      {orders.length === 0 ? (
        <ClayCard className="flex flex-col items-center gap-4 p-12 text-center">
          <Package className="size-12 text-muted-foreground/40" />
          <p className="text-muted-foreground">No orders yet.</p>
          <Link
            href="/dashboard/kit"
            className="text-sm text-primary underline underline-offset-2"
          >
            Browse kit
          </Link>
        </ClayCard>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <ClayCard
              key={order.id}
              className="flex items-center justify-between p-4"
            >
              <div>
                <p className="font-semibold text-foreground">
                  {order.item.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Qty: {order.quantity} &middot; Ordered{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                    STATUS_STYLES[order.status] ?? "bg-muted text-foreground"
                  }`}
                >
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
            </ClayCard>
          ))}
        </div>
      )}
    </div>
  );
}
