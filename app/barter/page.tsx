/* eslint-disable @typescript-eslint/no-explicit-any */
import BarterCard from "@/components/barter-card";
import { getAllProductsBarter } from "@/lib/actions/product";
import React from "react";

interface ProductData {
  id: string;
  sellerId: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  quantity: number | null;
  discount: number | null;
  condition: "new" | "used" | "rework" | string;
  status: string | null;
  primaryImageUrl?: string | null;
  sustainabilityRating?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ApiResponse {
  success: boolean;
  data?: ProductData[];
  message?: string;
  error?: unknown;
}

export default async function Page() {
  const response: ApiResponse = await getAllProductsBarter();
  const d = response.data || [];
  return (
    <div className="container mx-auto px-4 mt-40">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <BarterCard success={response.success}
          data={d as any}
        />
      </div>
    </div>
  );
}