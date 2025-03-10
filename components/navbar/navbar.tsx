/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient, signIn } from "@/lib/auth-client";
import Image from "next/image";
import { Profile } from "../profile";
import ThemeToggleButton from "../theme-button";
import RichNavigationMenu from "./nav-rich";
import { NavigationSheet } from "./nav-sheet";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { removeFromCart, updateCartItemQuantity } from "@/lib/actions/cart";

import { Minus, Plus, Search, ShoppingCart, User, X } from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { createTransaction } from "@/lib/actions/midtrans";
import { Separator } from "../ui/separator";
import CartBadge from "../cart-badge";
import { ScrollArea } from "../ui/scroll-area";
import NotifBadge from "../notifBadge";
import Notification from "../Notification";



interface NotificationType {
  id: string;
  createdAt: string;
  isRead: boolean;
  message: string;
  title: string;
  type: "info" | "success" | "warning" | "error";
  userId: string;
}
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
    maxQuantity?: number;
  };
}

interface CartDialogProps {
  cartCount: number;
  cartData: {
    items: CartItem[];
    cartTotal: number;
  };
  notifications: NotificationType[];
}
const MAX_QUANTITY = 2;

export default function Navbar({
  cartCount,
  cartData,
  notifications,
}: CartDialogProps) {
  const { data: session } = authClient.useSession();
  const [isPending, startTransition] = useTransition();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isSnapjsLoaded, setIsSnapjsLoaded] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Load Midtrans Snap.js when the component mounts
  useEffect(() => {
    const loadSnapjs = () => {
      // Check if the script is already loaded
      if (document.getElementById("snapjs-script")) {
        setIsSnapjsLoaded(true);
        return;
      }

      // Create script element
      const script = document.createElement("script");
      script.id = "snapjs-script";
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      script.setAttribute(
        "data-client-key",
        process.env.MIDTRANS_CLIENT_KEY || ""
      );

      // Set up event listeners
      script.onload = () => {
        console.log("Snapjs loaded successfully");
        setIsSnapjsLoaded(true);
      };

      script.onerror = () => {
        console.error("Failed to load Snapjs");
      };

      // Append to document
      document.head.appendChild(script);
    };

    loadSnapjs();

    // Cleanup function
    return () => {
      const script = document.getElementById("snapjs-script");
      if (script) {
        script.remove();
      }
    };
  }, []);

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

  const getDiscountedPrice = (price: number, discount: number) => {
    return price - price * (discount / 100);
  };

  const isAtMaxQuantity = (item: CartItem) => {
    const maxAllowed = item.product.maxQuantity || MAX_QUANTITY;
    return item.quantity >= maxAllowed;
  };

  const createTransactions = async () => {
    if (!isSnapjsLoaded) {
      console.error("Midtrans Snap.js is not loaded yet");
      alert("Payment system is still loading. Please try again in a moment.");
      return;
    }

    startTransition(() => {
      // Transform cart data to include sellerId for each product
      const transformedCartData = {
        items: cartData.items.map((item) => ({
          ...item,
          product: {
            ...item.product,
            sellerId: session?.user?.id || "", 
          },
        })),
        cartTotal: cartData.cartTotal,
      };

      // Format the data to match the expected CreateTransactionInput interface
      const transactionInput = {
        cartData: transformedCartData,
        shippingMethod: "regular", // Add default or get from form
        paymentMethod: "credit_card", // Add default or get from form
        shippingAddress: "Default Address", // Add default or get from form
        shippingCity: "Default City", // Add default or get from form
        shippingPostalCode: "12345", // Add default or get from form
      };

      createTransaction(transactionInput).then((response) => {
        if (response.success && window.snap) {
          console.log("Payment token received:", response.token);

          // Use the token to open Snap
          window.snap.pay(response.token, {
            onSuccess: function (result) {
              console.log("Payment success!", result);
              router.push("/payment/success?order_id=" + result.order_id);
            },
            onPending: function (result) {
              console.log("Payment pending!", result);
              router.push("/payment/pending?order_id=" + result.order_id);
            },
            onError: function (result) {
              console.log("Payment error!", result);
              router.push("/payment/error?order_id=" + result.order_id);
            },
            onClose: function () {
              console.log(
                "Customer closed the popup without finishing payment"
              );
            },
          });
        } else {
          console.error("Failed to get payment token:", response);
          alert("Failed to prepare payment. Please try again.");
        }
      });
    });
  };

  return (
    <div
      className={`z-50  ${
        pathname.startsWith("/manage") || pathname === "/auth" ? "hidden" : ""
      }`}
    >
      {isPending ? (
        <div className="fixed top-6 inset-x-4 h-16 max-w-screen-xl mx-auto">
          <Skeleton className="h-full w-full rounded-full" />
        </div>
      ) : (
        <nav className=" border-black border-2 fixed top-6 inset-x-4 h-16 bg-background dark:border-white dark:border-slate-700/70 max-w-screen-xl mx-auto rounded-full z-50">
          <div className="h-full flex items-center justify-between mx-auto px-4">
            <Link href={"/"}>
              <Image src="/logo.svg" alt="Logo" width={200} height={40} />
            </Link>
            {/* Desktop Menu */}
            <RichNavigationMenu className="hidden xl:flex" />

            <div className="flex items-center gap-3">
              {session === null ? (
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="hidden sm:inline-flex rounded-full"
                    onClick={() => router.push("/auth")}
                  >
                    Sign In
                  </Button>
                
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-3">
                  <div className="pt-2 flex flex-row items-center gap-2">
                    <div className="">
                      <Dialog>
                        <DialogTitle className="flex items-center gap-2"></DialogTitle>

                        <DialogTrigger>
                          <CartBadge count={cartCount} />
                        </DialogTrigger>
                        <DialogContent>
                          {cartCount === 0 ? (
                            <div className="p-4">
                              <h2 className="text-lg font-semibold">
                                Keranjang Belanja
                              </h2>
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
                                    const itemTotalPrice =
                                      discountedPrice * item.quantity;

                                    const itemImageUrl =
                                      item.product.primaryImageUrl ||
                                      (item.product.images &&
                                      item.product.images.length > 0
                                        ? item.product.images[0].cloudinaryUrl
                                        : "/api/placeholder/100/100");
                                    const maxQuantityReached =
                                      isAtMaxQuantity(item);

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
                                              Rp{" "}
                                              {discountedPrice.toLocaleString()}{" "}
                                              x {item.quantity}
                                            </span>

                                            {item.product.discount > 0 && (
                                              <span className="text-xs text-gray-500 line-through">
                                                Rp{" "}
                                                {item.product.price.toLocaleString()}
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
                                                disabled={
                                                  isUpdating === item.id ||
                                                  maxQuantityReached
                                                }
                                              >
                                                <Plus className="h-3 w-3" />
                                              </Button>
                                            </div>

                                            <div className="flex items-center gap-2">
                                              <span className="font-semibold text-sm">
                                                Rp{" "}
                                                {itemTotalPrice.toLocaleString()}
                                              </span>

                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-500 hover:text-red-500"
                                                onClick={() =>
                                                  handleRemoveItem(item.id)
                                                }
                                                disabled={
                                                  isUpdating === item.id
                                                }
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
                                  <span className="text-sm text-gray-500">
                                    Total
                                  </span>
                                  <span className="font-semibold">
                                    Rp {cartData.cartTotal.toLocaleString()}
                                  </span>
                                </div>

                                <DialogFooter className="flex-col gap-2 sm:flex-col sm:gap-2">
                                  <Button
                                    className="w-full"
                                    onClick={createTransactions}
                                    disabled={cartData.items.length === 0}
                                  >
                                    Lanjut ke Pembayaran
                                  </Button>

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
                    </div>
                    <div>
                      <Notification notifications={notifications} />
                    </div>
                  </div>
                  <Profile />
                </div>
              )}
              <ThemeToggleButton />
              {/* Mobile Menu */}
              <div className="md:hidden">
                <NavigationSheet />
              </div>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
