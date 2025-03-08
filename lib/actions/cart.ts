"use server";

import { and, eq } from "drizzle-orm";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db/db";
import { cart, product, productImage } from "../db/schema";

export async function addToCart(productId: string, quantity: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user.id;
  if (!userId) {
    return {
      success: false,
      error: "You must be logged in to add items to cart",
    };
  }

  try {
    const productExists = await db.query.product.findFirst({
      where: and(eq(product.id, productId), eq(product.status, "available")),
    });

    if (!productExists) {
      throw new Error("Product not available");
    }

    const existingCartItem = await db.query.cart.findFirst({
      where: and(eq(cart.userId, userId), eq(cart.productId, productId)),
    });

    const timestamp = new Date();

    if (existingCartItem) {
      // Update quantity if already in cart
      await db
        .update(cart)
        .set({
          quantity: existingCartItem.quantity + quantity,
          updatedAt: timestamp,
        })
        .where(and(eq(cart.userId, userId), eq(cart.productId, productId)));
    } else {
      // Add new item to cart
      await db.insert(cart).values({
        id: uuidv4(),
        userId,
        productId,
        quantity,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add to cart",
    };
  }
}

export async function removeFromCart(cartItemId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("You must be logged in to remove items from cart");
    }

    const userId = session.user.id;

    // Verify cart item belongs to current user
    const cartItem = await db.query.cart.findFirst({
      where: and(eq(cart.id, cartItemId), eq(cart.userId, userId)),
    });

    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    // Delete cart item
    await db.delete(cart).where(eq(cart.id, cartItemId));

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error removing from cart:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to remove from cart",
    };
  }
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("You must be logged in to update your cart");
    }

    if (quantity < 1) {
      throw new Error("Quantity must be at least 1");
    }

    const userId = session.user.id;

    // Verify cart item belongs to current user
    const cartItem = await db.query.cart.findFirst({
      where: and(eq(cart.id, cartItemId), eq(cart.userId, userId)),
    });

    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    // Update cart item quantity
    await db
      .update(cart)
      .set({
        quantity,
        updatedAt: new Date(),
      })
      .where(eq(cart.id, cartItemId));

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error updating cart item:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update cart item",
    };
  }
}

/**
 * Get cart items for current user
 */
export async function getCartItems() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("You must be logged in to view your cart");
    }

    const userId = session.user.id;

    // Get cart items with product details
    const cartItems = await db.query.cart.findMany({
      where: eq(cart.userId, userId),
      with: {
        product: {
          with: {
            images: {
              where: eq(productImage.isPrimary, true),
            },
          },
        },
      },
    });

    // Calculate cart totals
    const cartTotal = cartItems.reduce((total, item) => {
      const price = item.product.price || 0;
      const discount = item.product.discount || 0;
      const discountedPrice = price - price * (discount / 100);
      return total + discountedPrice * item.quantity;
    }, 0);

    return {
      success: true,
      items: cartItems,
      totalItems: cartItems.length,
      cartTotal: parseFloat(cartTotal.toFixed(2)),
    };
  } catch (error) {
    console.error("Error getting cart items:", error);
    return {
      success: false,
      items: [],
      totalItems: 0,
      cartTotal: 0,
      error:
        error instanceof Error ? error.message : "Failed to get cart items",
    };
  }
}

/**
 * Clear entire cart
 */
export async function clearCart() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("You must be logged in to clear your cart");
    }

    const userId = session.user.id;

    // Delete all cart items for the user
    await db.delete(cart).where(eq(cart.userId, userId));

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to clear cart",
    };
  }
}

/**
 * Check if product is in cart
 */
export async function isProductInCart(productId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: true, inCart: false };
    }

    const userId = session.user.id;

    // Check if product is in cart
    const cartItem = await db.query.cart.findFirst({
      where: and(eq(cart.userId, userId), eq(cart.productId, productId)),
    });

    return {
      success: true,
      inCart: !!cartItem,
      quantity: cartItem?.quantity || 0,
    };
  } catch (error) {
    console.error("Error checking if product is in cart:", error);
    return {
      success: false,
      inCart: false,
      quantity: 0,
      error:
        error instanceof Error
          ? error.message
          : "Failed to check if product is in cart",
    };
  }
}
