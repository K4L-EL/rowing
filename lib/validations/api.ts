import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().optional(),
  venue: z.string().min(1, "Venue is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be 0 or more"),
  capacity: z.number().int().positive().optional().nullable(),
  inviteOnly: z.boolean().optional(),
  menu: z.array(z.string()).optional(),
});

export const createKitItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be 0 or more"),
  description: z.string().min(1, "Description is required"),
  color: z.string().optional(),
  badge: z.string().optional(),
});

export const updateKitItemSchema = createKitItemSchema.partial();

export const createInvoiceSchema = z.object({
  userId: z.string().min(1, "User is required"),
  title: z.string().min(1, "Title is required"),
  amount: z.number().min(0, "Amount must be 0 or more"),
  dueDate: z.string().optional(),
  description: z.string().optional(),
});

export const updateInvoiceSchema = z.object({
  status: z.enum(["PENDING", "PAID", "OVERDUE", "CANCELLED"]).optional(),
  title: z.string().optional(),
  amount: z.number().min(0).optional(),
  dueDate: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});
