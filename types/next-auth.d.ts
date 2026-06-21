import type { DefaultSession } from "next-auth";

export type AppRole = "MEMBER" | "COACH" | "WELFARE_OFFICER" | "COMMITTEE" | "ADMIN";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: AppRole;
      onboardingComplete?: boolean;
      emailVerified?: Date | null;
    };
  }

  interface User {
    role?: AppRole;
    onboardingComplete?: boolean;
    emailVerified?: Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: AppRole;
    emailVerified?: Date | null;
  }
}
