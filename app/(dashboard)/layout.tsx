import { StoreProvider } from "@/components/providers/store-provider";

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}
