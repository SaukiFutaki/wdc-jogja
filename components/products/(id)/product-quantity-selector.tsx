"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddToCartButton from "./add-to-cart-button";

export default function ProductQuantitySelector({
  maxQuantity,
  productId,
}: {
  maxQuantity?: number;
  productId: string;
}) {
  const [quantity, setQuantity] = useState(0);

  return (
    <div className="flex  gap-4 items-center">
      <div>
        {maxQuantity === 0 ? (
          <p className="text-red-500">Stok habis</p>
        ) : (
          <div className="flex items-center border rounded-md ">
            <Button
              onClick={() => setQuantity(Math.max(quantity - 1, 0))}
              className="p-2 hover:bg-gray-100 disabled:opacity-50"
              disabled={quantity === 0}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="px-4 py-2 min-w-[40px] text-center">
              {quantity}
            </span>
            <Button
              onClick={() =>
                setQuantity(
                  maxQuantity
                    ? Math.min(quantity + 1, maxQuantity)
                    : quantity + 1
                )
              }
              className="p-2 hover:bg-gray-100 disabled:opacity-50"
              disabled={maxQuantity !== undefined && quantity >= maxQuantity}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      <>
        <AddToCartButton productId={productId} quantity={quantity} />
      </>
    </div>
  );
}
