/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { removeFromCart, updateCartItemQuantity } from "@/lib/actions/cart";
import { authClient } from "@/lib/auth-client";
import { Minus, Plus, Search, ShoppingCart, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import CartBadge from "./cart-badge";
import RichNavigationMenu from "./navbar/nav-rich";
import { Profile } from "./profile";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { createTransaction } from "@/lib/actions/midtrans";

export interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    discount: number;
    images: {
      cloudinaryUrl: string;
    }[];
    primaryImageUrl?: string;
  };
}

interface CartDialogProps {
  cartCount: number;
  cartData: {
    items: CartItem[];
    cartTotal: number;
  };
}

export default function Header({ cartCount, cartData }: CartDialogProps) {
  const[isPending,startTransition] = useTransition();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const handleRemoveItem = async (cartItemId: string) => {
    setIsUpdating(cartItemId);
    await removeFromCart(cartItemId);
    setIsUpdating(null);
  };

  const handleUpdateQuantity = async (
    cartItemId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;
    setIsUpdating(cartItemId);
    await updateCartItemQuantity(cartItemId, newQuantity);
    setIsUpdating(null);
  };

  // Calculate final price with discount
  const getDiscountedPrice = (price: number, discount: number) => {
    return price - price * (discount / 100);
  };

  const createTransactions = async () => {
    startTransition(() => {
      // Format the data to match the expected CreateTransactionInput interface
      const transactionInput = {
        cartData: cartData, // This already has the items and cartTotal
        shippingMethod: "regular", // Add default or get from form
        paymentMethod: "credit_card", // Add default or get from form
        shippingAddress: "Default Address", // Add default or get from form
        shippingCity: "Default City", // Add default or get from form
        shippingPostalCode: "12345" // Add default or get from form
      };
      
      // createTransaction(transactionInput).then((response) => {
      //   if (response.success) {
      //     // Option 1: Redirect to Midtrans URL
      //     // window.location.href = response.redirectUrl;
          
      //     // Option 2: Open Snap popup
      //     window.snap.pay(response.midtransToken.token, {
      //       onSuccess: function(result) {
      //         console.log('Payment success!', result);
      //         router.push('/payment/success?order_id=' + result.order_id);
      //       },
      //       onPending: function(result) {
      //         console.log('Payment pending!', result);
      //         router.push('/payment/pending?order_id=' + result.order_id);
      //       },
      //       onError: function(result) {
      //         console.log('Payment error!', result);
      //         router.push('/payment/error?order_id=' + result.order_id);
      //       },
      //       onClose: function() {
      //         console.log('Customer closed the popup without finishing payment');
      //       }
      //     });
      //   }
      // });
    });
  }
  return (
    <>
      <header
        className={`bg-[#111111] text-white p-4 flex items-center justify-between px-6 ${
          pathname.startsWith("/manage") || pathname === "/auth" ? "hidden" : ""
        }`}
      >
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold">
            <Image src="/logo.svg" alt="Logo" width={200} height={40} />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <RichNavigationMenu />
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search"
              className="bg-white rounded-full py-2 pl-10 pr-4 text-black w-[300px]"
            />
          </div>
          <Dialog>
            <DialogTitle className="flex items-center gap-2"></DialogTitle>
            <DialogTrigger>
              <CartBadge count={cartCount} />
            </DialogTrigger>
            <DialogContent>
              {cartCount === 0 ? (
                <div className="p-4">
                  <h2 className="text-lg font-semibold">Keranjang Belanja</h2>
                  <p className="text-sm text-gray-500">
                    Keranjang belanja Anda masih kosong.
                  </p>
                </div>
              ) : (
                <>
                  <ScrollArea className="max-h-[60vh]">
                    <div className="space-y-4 pr-4">
                      {cartData.items.map((item) => {
                        const discountedPrice = getDiscountedPrice(
                          item.product.price || 0,
                          item.product.discount || 0
                        );

                        // Calculate item total price based on quantity
                        const itemTotalPrice = discountedPrice * item.quantity;

                        const itemImageUrl =
                          item.product.primaryImageUrl ||
                          (item.product.images && item.product.images.length > 0
                            ? item.product.images[0].cloudinaryUrl
                            : "/api/placeholder/100/100");

                        return (
                          <div key={item.id} className="flex gap-4">
                            <div className="rounded-md overflow-hidden flex-shrink-0 w-20 h-20 relative">
                              <Image
                                src={itemImageUrl}
                                alt={item.product.name}
                                layout="fill"
                                objectFit="cover"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm line-clamp-2">
                                {item.product.name}
                              </h4>

                              <div className="flex items-baseline mt-1 gap-2">
                                <span className="text-sm">
                                  Rp {discountedPrice.toLocaleString()} x{" "}
                                  {item.quantity}
                                </span>

                                {item.product.discount > 0 && (
                                  <span className="text-xs text-gray-500 line-through">
                                    Rp {item.product.price.toLocaleString()}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center border rounded-md">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-none"
                                    onClick={() =>
                                      handleUpdateQuantity(
                                        item.id,
                                        item.quantity - 1
                                      )
                                    }
                                    disabled={
                                      isUpdating === item.id ||
                                      item.quantity <= 1
                                    }
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>

                                  <span className="w-8 text-center text-sm">
                                    {item.quantity}
                                  </span>

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-none"
                                    onClick={() =>
                                      handleUpdateQuantity(
                                        item.id,
                                        item.quantity + 1
                                      )
                                    }
                                    disabled={isUpdating === item.id}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-sm">
                                    Rp {itemTotalPrice.toLocaleString()}
                                  </span>

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-500 hover:text-red-500"
                                    onClick={() => handleRemoveItem(item.id)}
                                    disabled={isUpdating === item.id}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>

                  <Separator className="my-2" />

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Total</span>
                      <span className="font-semibold">
                        Rp {cartData.cartTotal.toLocaleString()}
                      </span>
                    </div>

                    <DialogFooter className="flex-col gap-2 sm:flex-col sm:gap-2">
                      <Button className="w-full"
                        onClick={createTransactions}
                        // disabled={isPending || cartData.items.length === 0}
                        disabled
                      >Lanjut ke Pembayaran</Button>

                      <Button
                        variant="outline"
                        asChild
                        className="w-full flex items-center gap-2"
                      >
                        <Link href="/cart">
                          <ShoppingCart className="h-4 w-4" />
                          <span>Lihat Keranjang Lengkap</span>
                        </Link>
                      </Button>
                    </DialogFooter>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
          {session === null ? (
            <Link href={"/auth"}>
              <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                  <User />
                </span>
              </button>
            </Link>
          ) : (
            <Profile />
          )}
        </div>
      </header>
    </>
  );
}
