import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bell } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { readNotification } from "@/lib/actions/notification";
import { useRouter } from "next/navigation";

interface Notification {
  id: string;
  createdAt: string;
  isRead: boolean;
  message: string;
  title: string;
  type: "info" | "success" | "warning" | "error";
  userId: string;
}

export default function Notification({
  notifications: initialNotifications,
}: {
  notifications: Notification[];
}) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleReadNotification = async (id: string) => {
    // First update the local state for immediate UI update
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
    
    // Then update in the database
    const result = await readNotification(id);
    
    // Refresh server data to sync with database
    if (result.success) {
      router.refresh();
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative">
          <Bell className="h-6 w-6" />
          {notifications.some((notification) => !notification.isRead) && (
            <div
              className={cn(
                "absolute -top-1 -right-1 flex items-center justify-center",
                "min-w-[20px] h-5 px-1 rounded-full text-xs font-medium",
                "bg-red-600 text-white"
              )}
            >
              {notifications.filter((notification) => !notification.isRead).length}
            </div>
          )}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notifikasi</DialogTitle>
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-2">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      notification.isRead ? "bg-background" : "bg-muted/50"
                    }`}
                    onClick={() => handleReadNotification(notification.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{notification.title}</span>
                        {!notification.isRead && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm truncate mt-1">{notification.message}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  Tidak ada notifikasi
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}