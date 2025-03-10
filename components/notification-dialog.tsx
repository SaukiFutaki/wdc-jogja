import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, AlertTriangle, Info, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

// Define the notification type
interface Notification {
  id: string
  createdAt: string
  isRead: boolean
  message: string
  title: string
  type: "info" | "success" | "warning" | "error"
  userId: string
}

interface NotificationDialogProps {
  notification: Notification | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onMarkAsRead?: (id: string) => void
}

export function NotificationDialog({ notification, open, onOpenChange, onMarkAsRead }: NotificationDialogProps) {
  if (!notification) return null

  const handleMarkAsRead = () => {
    if (onMarkAsRead && !notification.isRead) {
      onMarkAsRead(notification.id)
    }
  }

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "error":
        return <X className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getTypeBadge = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Info</Badge>
      case "success":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Success</Badge>
      case "warning":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Warning</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Error</Badge>
      default:
        return <Badge variant="outline">Notification</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" onInteractOutside={handleMarkAsRead} onEscapeKeyDown={handleMarkAsRead}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTypeIcon(notification.type)}
            <span>{notification.title}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getTypeBadge(notification.type)}
              {!notification.isRead && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </div>
          </div>
          <div className={cn("text-sm", notification.isRead ? "text-muted-foreground" : "font-medium")}>
            {notification.message}
          </div>
          <div className="text-xs text-muted-foreground">User ID: {notification.userId}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

