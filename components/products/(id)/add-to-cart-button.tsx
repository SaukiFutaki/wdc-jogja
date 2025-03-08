"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { addToCart } from "@/lib/actions/cart";
import { Loader2 } from "lucide-react";

export default function AddToCartButton({ productId, quantity }: { productId: string, quantity: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = () => {
    startTransition(() => {
      addToCart(productId,quantity).then((response) => {
        if (response.success) {
          router.refresh();
        }
      });
    });
  };

  return (
    <Button onClick={handleAddToCart} className={`flex-1 bg-card text-white ${quantity === 0 ? "cursor-pointer": ""}`} disabled={isPending || quantity === 0}>
      {isPending ? <Loader2 className="animate-spin text-center w-4 h-4"/> : "Tambah ke keranjang"}
    </Button>
  );
}
