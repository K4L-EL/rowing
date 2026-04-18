import { redirect } from "next/navigation";
import { auth } from "@/auth";

/** Ensures the current user is an admin. Redirects otherwise. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/dashboard/welfare");
  }
  return session;
}
