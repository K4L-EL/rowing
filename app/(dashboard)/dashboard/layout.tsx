import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardShellLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user?.email && !session.user.emailVerified) {
    redirect("/verify-email-notice");
  }

  return (
    <div className="flex min-h-screen">
      <DashboardNav />
      <div className="min-w-0 flex-1 pt-14 md:pt-0">
        <div className="p-5 md:p-8">{children}</div>
      </div>
    </div>
  );
}
