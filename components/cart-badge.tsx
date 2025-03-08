"use client"

import { ShoppingCart } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface CartBadgeProps {
  count?: number
  maxCount?: number
  className?: string
  iconClassName?: string
  badgeClassName?: string
}

export default function CartBadge({
  count = 0,
  maxCount = 999,
  className,
  iconClassName,
  badgeClassName,
}: CartBadgeProps) {
  const [clientCount, setClientCount] = useState(0)

  useEffect(() => {
    setClientCount(count) // Sinkronisasi count saat komponen mount
  }, [count])

  const showBadge = clientCount > 0
  const formattedCount = clientCount > maxCount ? `${maxCount}+` : clientCount

  return (
    <div className={cn("relative", className)}>
      <ShoppingCart className={cn("h-6 w-6", iconClassName)} />
      {showBadge && (
        <div
          className={cn(
            "absolute -top-2 -right-2 flex items-center justify-center",
            "min-w-5 h-5 px-1 rounded-full text-xs font-medium",
            "bg-red-500 text-white",
            badgeClassName
          )}
        >
          {formattedCount}
        </div>
      )}
    </div>
  )
}
