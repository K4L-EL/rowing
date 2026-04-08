import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: "USER" | "WELFARE_OFFICER";
    };
  }

  interface User {
    role?: "USER" | "WELFARE_OFFICER";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "USER" | "WELFARE_OFFICER";
  }
}
