import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { WelcomeWizard } from "@/components/onboarding/welcome-wizard";

export default async function WelcomePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { squad: true, name: true },
  });

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-lg items-center">
      <WelcomeWizard
        userName={dbUser?.name ?? session.user.name}
        existingSquad={dbUser?.squad as string | null}
      />
    </div>
  );
}
