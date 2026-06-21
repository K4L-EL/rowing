import { prisma } from "@/lib/prisma";

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  body?: string,
  link?: string,
): Promise<void> {
  try {
    await prisma.notification.create({
      data: { userId, type, title, body, link },
    });
  } catch (e) {
    console.error("[notifications] create failed", e);
  }
}
