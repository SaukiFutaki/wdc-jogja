"use server";


import { auth } from "@/auth";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db/db";
import { notification } from "../db/schema";

// Create a new notification
export async function createNotification({
  userId,
  title,
  message,
  type,
  linkTo,
}: {
  userId: string;
  title: string;
  message: string;
  type: "transaction" | "barter" | "rework" | "system";
  linkTo?: string;
}) {
  try {
    const notificationId = uuidv4();
    const newNotification = await db.insert(notification).values({
      id: notificationId,
      userId,
      title,
      message,
      type,
      linkTo,
      isRead: false,
      createdAt: new Date(),
    });

    revalidatePath("/notifications");
    return { success: true, notificationId ,newNotification};
  } catch (error) {
    console.error("Failed to create notification:", error);
    return { success: false, error: "Failed to create notification" };
  }
}

// Get notifications for current user
export async function getUserNotifications() {
  try {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userNotifications = await db
      .select()
      .from(notification)
      .where(eq(notification.userId, session.user.id))
      .orderBy(desc(notification.createdAt));

    return { success: true, notifications: userNotifications };
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return { success: false, error: "Failed to fetch notifications" };
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string) {
  try {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    await db
      .update(notification)
      .set({ isRead: true })
      .where(
        and(
          eq(notification.id, notificationId),
          eq(notification.userId, session.user.id)
        )
      );

    revalidatePath("/notifications");
    return { success: true };
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    return { success: false, error: "Failed to mark notification as read" };
  }
}

// Mark all notifications as read
export async function markAllNotificationsAsRead() {
  try {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    await db
      .update(notification)
      .set({ isRead: true })
      .where(eq(notification.userId, session.user.id));

    revalidatePath("/notifications");
    return { success: true };
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
    return { success: false, error: "Failed to mark all notifications as read" };
  }
}

// Delete a notification
export async function deleteNotification(notificationId: string) {
  try {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    await db
      .delete(notification)
      .where(
        and(
          eq(notification.id, notificationId),
          eq(notification.userId, session.user.id)
        )
      );

    revalidatePath("/notifications");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete notification:", error);
    return { success: false, error: "Failed to delete notification" };
  }
}

// Get unread notification count
export async function getUnreadNotificationCount() {
  try {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const unreadNotifications = await db
      .select()
      .from(notification)
      .where(
        and(
          eq(notification.userId, session.user.id),
          eq(notification.isRead, false)
        )
      );

    return { success: true, count: unreadNotifications.length };
  } catch (error) {
    console.error("Failed to get unread notification count:", error);
    return { success: false, error: "Failed to get unread notification count" };
  }
}

export async function readNotification(notificationId: string) {
  try {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    await db
      .update(notification)
      .set({ isRead: true })
      .where(
        and(
          eq(notification.id, notificationId),
          eq(notification.userId, session.user.id)
        )
      );

    revalidatePath("/notifications");
    return { success: true };
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    return { success: false, error: "Failed to mark notification as read" };
  }
}