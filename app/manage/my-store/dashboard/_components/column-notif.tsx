/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { Notification } from "@/components/notif-ex";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ColumnDef, Row } from "@tanstack/react-table";
import {
  ArrowUpDown,
  CircleDollarSign,
  Percent,
  Star
} from "lucide-react";
import Image from "next/image";

export const columns: ColumnDef<Notification>[] = [
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
  
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
  ]
  