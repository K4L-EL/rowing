import { z } from "zod";
import { Squad } from "@prisma/client";

const squadValues = Object.values(Squad) as [string, ...string[]];

export const updateProfileSchema = z.object({
  name: z.string().max(120).optional(),
  squad: z.enum(squadValues as any).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});
