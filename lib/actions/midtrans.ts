"use server";

import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {auth} from "@/auth";
import { headers } from "next/headers";
import { db } from "../db/db";
import {
  transaction,
  payment,
  shipping,
  product,
  cart,
  notification,
  user,
} from "@/lib/db/schema";
import { redirect } from "next/navigation";

// Configure Midtrans client - install midtrans-client package
import midtransClient from "midtrans-client";

// Initialize Midtrans Snap API client
const snap = new midtransClient.Snap({
  isProduction: process.env.NODE_ENV === "production",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export interface CartItem {
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      price: number;
      discount: number;
      sellerId: string;
      images: {
        cloudinaryUrl: string;
      }[];
      primaryImageUrl?: string;
    };
  }
  
  // Transaction input interface
  export interface CreateTransactionInput {
    cartData: {
      items: CartItem[];
      cartTotal: number;
    };
    shippingMethod: string;
    paymentMethod: string;
    shippingAddress: string;
    shippingCity: string;
    shippingPostalCode: string;
  }
  export async function createTransaction(input: CreateTransactionInput) {
    try {
      // Get authenticated user
      const session = await auth.api.getSession({
        headers: await headers(),
      });
  
      if (!session?.user) {
        throw new Error("You must be logged in to create a transaction");
      }
  
      const buyerId = session.user.id;
      const { cartData, shippingMethod, paymentMethod, shippingAddress, shippingCity, shippingPostalCode } = input;
  
      // Fetch buyer information
      const buyerData = await db.query.user.findFirst({
        where: eq(user.id, buyerId),
      });
  
      if (!buyerData) {
        throw new Error("Buyer information not found");
      }
  
      // Check if cart is empty
      if (cartData.items.length === 0) {
        throw new Error("Your cart is empty");
      }
  
      // Group items by seller
      const itemsBySeller = cartData.items.reduce((acc, item) => {
        const sellerId = item.product.sellerId;
        if (!acc[sellerId]) {
          acc[sellerId] = [];
        }
        acc[sellerId].push(item);
        return acc;
      }, {} as Record<string, CartItem[]>);
  
      // Create transactions for each seller
      const transactionIds = [];
      let totalAmount = 0;
      const orderItemDetails = [];
  
      for (const [sellerId, items] of Object.entries(itemsBySeller)) {
        const sellerTotal = items.reduce((total, item) => {
          const price = item.product.price || 0;
          const discount = item.product.discount || 0;
          const discountedPrice = price - (price * discount / 100);
          return total + (discountedPrice * item.quantity);
        }, 0);
  
        totalAmount += sellerTotal;
  
        // Create transaction record
        const transactionId = nanoid();
        await db.insert(transaction).values({
          id: transactionId,
          buyerId: buyerId,
          sellerId: sellerId,
          productId: items[0].product.id, // For single product transactions
          totalPrice: sellerTotal,
          paymentStatus: "pending",
          orderStatus: "processing",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
  
        // Add items to order details for Midtrans
        for (const item of items) {
          const productItem = item.product;
          const discountedPrice = productItem.price - (productItem.price * (productItem.discount || 0) / 100);
          
          orderItemDetails.push({
            id: productItem.id,
            price: discountedPrice,
            quantity: item.quantity,
            name: productItem.name.substring(0, 50), // Midtrans has character limits
          });
  
          // Update product quantity
          const productData = await db.query.product.findFirst({
            where: eq(product.id, productItem.id),
          });
          
          if (productData) {
            await db.update(product)
              .set({ 
                quantity: (productData.quantity || 1) - item.quantity,
                status: (productData.quantity || 1) - item.quantity <= 0 ? "sold" : "available",
                updatedAt: new Date()
              })
              .where(eq(product.id, productItem.id));
          }
        }
  
        // Create shipping record
        await db.insert(shipping).values({
          id: nanoid(),
          transactionId: transactionId,
          shippingMethod: shippingMethod,
          shippingStatus: "preparing",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
  
        // Create notification for seller
        await db.insert(notification).values({
          id: nanoid(),
          userId: sellerId,
          title: "New Order Received",
          message: `You have received a new order worth Rp ${sellerTotal.toLocaleString()}`,
          type: "transaction",
          linkTo: `/seller/orders/${transactionId}`,
          createdAt: new Date(),
        });
  
        transactionIds.push(transactionId);
      }
  
      // Generate unique order ID for Midtrans
      const orderId = `ORDER-${nanoid(10)}`;
  
      // Create Midtrans transaction parameter
      const parameter = {
        transaction_details: {
          order_id: orderId,
          gross_amount: totalAmount,
        },
        customer_details: {
          first_name: buyerData.name || "Customer",
          email: buyerData.email,
          phone: buyerData.phone || "",
          shipping_address: {
            address: shippingAddress,
            city: shippingCity,
            postal_code: shippingPostalCode,
          },
        },
        item_details: orderItemDetails,
        callbacks: {
          finish: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?order_id=${orderId}`,
          error: `${process.env.NEXT_PUBLIC_APP_URL}/payment/error?order_id=${orderId}`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/payment/pending?order_id=${orderId}`,
        },
      };
  
      // Create Midtrans Snap token
      const midtransToken = await snap.createTransaction(parameter);
  
      // Create payment record
      const paymentId = nanoid();
      await db.insert(payment).values({
        id: paymentId,
        transactionId: transactionIds[0], // Link to first transaction if multiple
        paymentMethod: paymentMethod,
        paymentStatus: "pending",
        paymentDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
  
      // Create notification for buyer
      await db.insert(notification).values({
        id: nanoid(),
        userId: buyerId,
        title: "Order Created",
        message: `Your order has been created. Please complete the payment.`,
        type: "transaction",
        linkTo: `/orders/${transactionIds[0]}`,
        createdAt: new Date(),
      });
  
      // Clear the cart after successful transaction creation
      for (const item of cartData.items) {
        await db.delete(cart).where(eq(cart.id, item.id));
      }
  
      // Return the necessary data
      return {
        success: true,
        transactionIds,
        orderId,
        midtransToken,
        redirectUrl: midtransToken.redirect_url,
      };
    } catch (error) {
      console.error("Error creating transaction:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create transaction",
      };
    }
  }

// Handle Midtrans webhook callback
export async function handleMidtransCallback(req: Request) {
  try {
    // Parse webhook notification from Midtrans
    const body = await req.json();

    // Verify signature (important for security)
    // In a real implementation, you'd validate this with the Midtrans signature

    const { order_id, transaction_status, fraud_status, payment_type } = body;

    // Extract transaction IDs from your database using order_id
    // This assumes you've stored the mapping between Midtrans order_id and your transaction IDs
    const relatedTransactions = await db.query.transaction.findMany({
      where: eq(transaction.id, order_id.replace("ORDER-", "")),
    });

    // If no transactions found, return error
    if (relatedTransactions.length === 0) {
      return { success: false, error: "No matching transactions found" };
    }

    let paymentStatus = "pending";
    let orderStatus = "processing";

    // Process based on transaction_status
    if (
      transaction_status === "capture" ||
      transaction_status === "settlement"
    ) {
      if (fraud_status === "accept") {
        paymentStatus = "paid";
      }
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      paymentStatus = "failed";
      orderStatus = "canceled";

      // Return items to inventory
      for (const tx of relatedTransactions) {
        const productData = await db.query.product.findFirst({
          where: eq(product.id, tx.productId),
        });

        if (productData) {
          await db
            .update(product)
            .set({
              quantity: (productData.quantity || 0) + 1, // Assume 1 quantity per transaction for simplicity
              status: "available",
              updatedAt: new Date(),
            })
            .where(eq(product.id, tx.productId));
        }
      }
    }

    // Update all related transactions
    for (const tx of relatedTransactions) {
      // Update transaction status
      await db
        .update(transaction)
        .set({
          paymentStatus,
          orderStatus,
          updatedAt: new Date(),
        })
        .where(eq(transaction.id, tx.id));

      // Update payment records
      const paymentRecords = await db.query.payment.findMany({
        where: eq(payment.transactionId, tx.id),
      });

      for (const paymentRecord of paymentRecords) {
        await db
          .update(payment)
          .set({
            paymentStatus:
              paymentStatus === "paid" ? "completed" : paymentStatus,
            paymentDate: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(payment.id, paymentRecord.id));
      }

      // Create notifications
      // For buyer
      await db.insert(notification).values({
        id: nanoid(),
        userId: tx.buyerId,
        title:
          paymentStatus === "paid" ? "Payment Successful" : "Payment Failed",
        message:
          paymentStatus === "paid"
            ? `Your payment for order has been confirmed.`
            : `Your payment for order has failed. Please try again.`,
        type: "transaction",
        linkTo: `/orders/${tx.id}`,
        createdAt: new Date(),
      });

      // For seller
      await db.insert(notification).values({
        id: nanoid(),
        userId: tx.sellerId,
        title: paymentStatus === "paid" ? "Payment Received" : "Payment Failed",
        message:
          paymentStatus === "paid"
            ? `Payment for order has been confirmed.`
            : `Payment for order has failed.`,
        type: "transaction",
        linkTo: `/seller/orders/${tx.id}`,
        createdAt: new Date(),
      });
    }

    // Success response
    return { success: true, status: paymentStatus };
  } catch (error) {
    console.error("Error processing Midtrans callback:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to process payment callback",
    };
  }
}

// Get transactions for current user
export async function getUserTransactions(status?: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("You must be logged in to view your transactions");
    }

    const userId = session.user.id;

    // Query builder for transactions
    let query = db.query.transaction.findMany({
      where: eq(transaction.buyerId, userId),
      with: {
        product: {
          with: {
            images: {
              where: eq(product.id, transaction.productId),
              limit: 1,
            },
          },
        },
        seller: true,
        payment: true,
        shipping: true,
      },
      orderBy: (transaction, { desc }) => [desc(transaction.createdAt)],
    });

    // Apply status filter if provided
    if (status) {
      query = db.query.transaction.findMany({
        where: (transaction, { eq, and }) =>
          and(
            eq(transaction.buyerId, userId),
            eq(transaction.orderStatus, status)
          ),
        with: {
          product: {
            with: {
              images: {
                where: eq(product.id, transaction.productId),
                limit: 1,
              },
            },
          },
          seller: true,
          payment: true,
          shipping: true,
        },
        orderBy: (transaction, { desc }) => [desc(transaction.createdAt)],
      });
    }

    const transactions = await query;

    return {
      success: true,
      transactions,
    };
  } catch (error) {
    console.error("Error getting user transactions:", error);
    return {
      success: false,
      transactions: [],
      error:
        error instanceof Error ? error.message : "Failed to get transactions",
    };
  }
}

// Get seller orders (transactions where user is seller)
export async function getSellerOrders(status?: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("You must be logged in to view seller orders");
    }

    const sellerId = session.user.id;

    // Query builder for seller orders
    let query = db.query.transaction.findMany({
      where: eq(transaction.sellerId, sellerId),
      with: {
        product: {
          with: {
            images: {
              where: eq(product.id, transaction.productId),
              limit: 1,
            },
          },
        },
        buyer: true,
        payment: true,
        shipping: true,
      },
      orderBy: (transaction, { desc }) => [desc(transaction.createdAt)],
    });

    // Apply status filter if provided
    if (status) {
      query = db.query.transaction.findMany({
        where: (transaction, { eq, and }) =>
          and(
            eq(transaction.sellerId, sellerId),
            eq(transaction.orderStatus, status)
          ),
        with: {
          product: {
            with: {
              images: {
                where: eq(product.id, transaction.productId),
                limit: 1,
              },
            },
          },
          buyer: true,
          payment: true,
          shipping: true,
        },
        orderBy: (transaction, { desc }) => [desc(transaction.createdAt)],
      });
    }

    const orders = await query;

    return {
      success: true,
      orders,
    };
  } catch (error) {
    console.error("Error getting seller orders:", error);
    return {
      success: false,
      orders: [],
      error:
        error instanceof Error ? error.message : "Failed to get seller orders",
    };
  }
}
