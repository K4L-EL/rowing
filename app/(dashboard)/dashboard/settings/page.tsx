import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ClayCard } from "@/components/clay-card";
import { SettingsForm } from "./settings-form";
import { SettingsPasswordForm } from "./settings-password-form";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, squad: true },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your profile and security preferences.
        </p>
      </div>

      <ClayCard className="p-6">
        <h2 className="mb-4 text-lg font-bold text-foreground">Profile</h2>
        <SettingsForm
          userName={dbUser?.name ?? ""}
          userSquad={(dbUser?.squad as string) ?? ""}
        />
      </ClayCard>

      <ClayCard className="p-6">
        <h2 className="mb-4 text-lg font-bold text-foreground">Security</h2>
        <SettingsPasswordForm />
      </ClayCard>
    </div>
  );
}
