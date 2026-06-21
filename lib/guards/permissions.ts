import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { serverHasPermission } from "@/lib/permissions";
import type { Permission } from "@/lib/permissions";

export async function requirePermission(permission: Permission) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  if (!serverHasPermission(session.user.role as any, permission)) {
    redirect("/dashboard/welfare");
  }
  return session;
}
