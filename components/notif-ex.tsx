"use client"

import { useState } from "react"
import { NotificationDialog } from "./notification-dialog"


export interface Notification {
    id: string
    createdAt: string
    isRead: boolean
    message: string
    title: string
    type: "info" | "success" | "warning" | "error"
    userId: string
  }
  


export default function NotificationExample({notifications} : {notifications: Notification[]}) {

  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleOpenNotification = (notification: Notification) => {
    setSelectedNotification(notification)
    setDialogOpen(true)
  }

  const handleMarkAsRead = (id : string)  => {
    // Mark notification as read
    console.log("Marking notification as read:", id)
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      <div className="space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              notification.isRead ? "bg-background" : "bg-muted/50"
            }`}
            onClick={() => handleOpenNotification(notification)}
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
        ))}
      </div>

      <NotificationDialog
        notification={selectedNotification}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onMarkAsRead={handleMarkAsRead}
      />
    </div>
  )
}

