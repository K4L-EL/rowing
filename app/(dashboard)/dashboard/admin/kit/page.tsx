import Link from "next/link";
import { ClayCard } from "@/components/clay-card";
import { Button } from "@/components/ui/button";
import { requirePermission } from "@/lib/guards/permissions";
import { prisma } from "@/lib/prisma";
import { Plus, Archive, Pencil } from "lucide-react";
import { AdminKitClient } from "./admin-kit-client";

export default async function AdminKitPage() {
  await requirePermission("manage:system");

  const items = await prisma.kitItem.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/admin"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Admin
        </Link>
      </div>
      <AdminKitClient items={items} />
    </div>
  );
}
