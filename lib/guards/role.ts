import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { AppRole } from "@/types/next-auth";

/** Redirects to login if unauthenticated, or to /dashboard if the user doesn't have the required role. */
export async function requireRole(...roles: AppRole[]) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  if (!roles.includes(session.user.role as AppRole)) {
    redirect("/dashboard");
  }
  return session;
}
