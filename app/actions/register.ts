"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().max(120).optional(),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type RegisterActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};

export async function registerAction(
  _prev: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> {
  const raw = {
    name: (formData.get("name") as string) || undefined,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  if (existing) {
    return { error: "An account with this email already exists." };
  }
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.user.create({
    data: {
      email: parsed.data.email.toLowerCase(),
      name: parsed.data.name?.trim() || null,
      passwordHash,
    },
  });
  return { success: true };
}
