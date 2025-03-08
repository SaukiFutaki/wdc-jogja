
"use client";

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
import { ActionCell } from "./action-row";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  condition: 'new' | 'used' | 'rework';
  quantity: number;
  discount: number;
  type: 'barter' | 'jual';
  sustainableRating: number;
  primaryImageUrl?: string;
  status: string;
  updatedAt: string;
}

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex justify-center">
        <Checkbox
          className="rounded-full"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Checkbox
          className="rounded-full"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama Produk
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 h-10 w-10">
            {product.primaryImageUrl ? (
              <Image
                width={40}
                height={40}
                src={product.primaryImageUrl}
                alt={`Image of ${product.name}`}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-500">
                No img
              </div>
            )}
          </div>
          <div>
            <div className="font-medium">{product.name}</div>
            <div
              className="text-sm text-gray-500 truncate max-w-[250px]"
              title={product.description}
            >
              {product.description}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full justify-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.original.type}</div>;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-center"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
              >
                <CircleDollarSign />
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Harga produk</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },

    cell: ({ row }) => {
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(row.original.price);

      const priceAfterDiscount =
        row.original.price - (row.original.price * row.original.discount) / 100;

      const isPriceStrikethrough = row.original.type === "barter";

      return (
        <div className="text-center">
          <div
            className={cn(
              isPriceStrikethrough && "line-through text-gray-500",
              isPriceStrikethrough ? "opacity-50" : ""
            )}
          >
            {formatted}
          </div>
          {!isPriceStrikethrough && (
            <div className="text-xs text-green-500">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(priceAfterDiscount)}
            </div>
          )}
          {isPriceStrikethrough && (
            <div className="text-xs text-gray-500">Barter</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kategori
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="text-start">{row.original.category || "-"}</div>;
    },
  },
  {
    accessorKey: "condition",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full justify-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kondisi
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.original.condition || "-"}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full justify-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          {row.original.status === "active" ? (
            <Badge variant="default">{row.original.status}</Badge>
          ) : (
            <Badge variant="destructive">{row.original.status}</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full justify-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Jumlah
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.original.quantity}</div>;
    },
  },
  {
    accessorKey: "discount",
    header: ({ column }) => {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-center"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
              >
                <Percent />
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Nilai diskon produk</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.original.discount}%</div>;
    },
  },
  {
    accessorKey: "sustainableRating",
    header: ({ column }) => {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-center"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
              >
                Rating
                <Star className="ml-2 h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rating keberlanjutan produk</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center justify-center">
          <Star className="fill-yellow-400 text-yellow-400 w-4 h-4" />
          <span className="ml-2">{row.original.sustainableRating}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full justify-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Updated At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.updatedAt);
      return (
        <div className="text-center">{date.toLocaleDateString("id-ID")}</div>
      );
    },
  },

  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }: { row: Row<Product> }) => <ActionCell row={row} />
  },
];
