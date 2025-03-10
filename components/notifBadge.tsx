"use client"

import { Bell } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface NotifBadgeProps {
  count?: number
  maxCount?: number
  className?: string
  iconClassName?: string
  badgeClassName?: string
}

export default function NotifBadge({
  count = 0,
  maxCount = 99,
  className,
  iconClassName,
  badgeClassName,
}: NotifBadgeProps) {
  const [clientCount, setClientCount] = useState(0)

  useEffect(() => {
    setClientCount(count) // Sinkronisasi count saat komponen mount
  }, [count])

  const showBadge = clientCount > 0
  const formattedCount = clientCount > maxCount ? `${maxCount}+` : clientCount

  return (
    <div className={cn("relative", className)}>
      <Bell className={cn("h-6 w-6", iconClassName)} />
      {showBadge && (
        <div
          className={cn(
            "absolute -top-1 -right-1 flex items-center justify-center",
            "min-w-[20px] h-5 px-1 rounded-full text-xs font-medium",
            "bg-red-600 text-white",
            badgeClassName
          )}
        >
          {formattedCount}
        </div>
      )}
    </div>
  )
}