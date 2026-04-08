import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export default function DashboardShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <DashboardNav />
      <div className="min-w-0 flex-1 p-5 md:p-8">{children}</div>
    </div>
  );
}
