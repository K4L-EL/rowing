import { z } from "zod";

export const requestResetSchema = z.object({
  email: z.string().email("Valid email is required"),
});

export const confirmResetSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});
