/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth } from "@/auth";
import {
  cart,
  notification,
  payment,
  product,
  productImage,
  shipping,
  transaction,
  user,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { db } from "../db/db";

// Configure Midtrans client - install midtrans-client package
import midtransClient from "midtrans-client";

// Initialize Midtrans Snap API client
const snap = new midtransClient.Snap({
  isProduction: process.env.NODE_ENV === "production",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// Initialize Midtrans Core API client (untuk mendapatkan detail VA)
const core = new midtransClient.CoreApi({
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
  paymentMethod: string; // credit_card, bank_transfer, e_wallet, cod
  bankName?: string; // BCA, BNI, Mandiri, etc. (untuk bank_transfer)
  eWalletType?: string; // GOPAY, OVO, etc. (untuk e_wallet)
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
    const {
      cartData,
      shippingMethod,
      paymentMethod,
      bankName,
      eWalletType,
      shippingAddress,
      shippingCity,
      shippingPostalCode,
    } = input;

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
        const discountedPrice = price - (price * discount) / 100;
        return total + discountedPrice * item.quantity;
      }, 0);

      const sellerExists = await db.query.user.findFirst({
        where: eq(user.id, sellerId),
      });
      
      if (!sellerExists) {
        throw new Error(`Seller with ID ${sellerId} does not exist`);
      }
      
      totalAmount += sellerTotal;

      // Create transaction record
      const transactionId = nanoid();
      await db.insert(transaction).values({
        id: transactionId,
        buyerId: buyerId,
        sellerId: sellerId,
        productId: items[0].product.id, // For single product transactions
        totalPrice: sellerTotal,
        paymentStatus: "pending", // Using the appropriate enum value from schema
        orderStatus: "processing", // Using the appropriate enum value from schema
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Add items to order details for Midtrans
      for (const item of items) {
        const productItem = item.product;
        const discountedPrice =
          productItem.price -
          (productItem.price * (productItem.discount || 0)) / 100;

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
          await db
            .update(product)
            .set({
              quantity: (productData.quantity || 1) - item.quantity,
              status:
                (productData.quantity || 1) - item.quantity <= 0
                  ? "sold"
                  : "available",
              updatedAt: new Date(),
            })
            .where(eq(product.id, productItem.id));
        }
      }

      // Create shipping record
      await db.insert(shipping).values({
        id: nanoid(),
        transactionId: transactionId,
        shippingMethod: shippingMethod,
        shippingStatus: "preparing", // Using the appropriate enum value from schema
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create notification for seller
      await db.insert(notification).values({
        id: nanoid(),
        userId: sellerId,
        title: "New Order Received",
        message: `You have received a new order worth Rp ${sellerTotal.toLocaleString()}`,
        type: "transaction", // Using the appropriate enum value from schema
        linkTo: `/seller/orders/${transactionId}`,
        createdAt: new Date(),
      });

      transactionIds.push(transactionId);
    }

    // Generate unique order ID for Midtrans
    const orderId = `ORDER-${nanoid(10)}`;

    // Prepare parameter for Midtrans Snap
    const parameter: {
      transaction_details: {
        order_id: string;
        gross_amount: number;
      };
      customer_details: {
        first_name: string;
        email: string;
        phone: string;
        shipping_address: {
          address: string;
          city: string;
          postal_code: string;
        };
      };
      item_details: any[];
      enabled_payments: string[];
    } = {
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
      enabled_payments: [],
    };

    // Set enabled_payments based on paymentMethod - MODIFIED TO EXCLUDE CREDIT CARD
    if (paymentMethod === "bank_transfer") {
      parameter.enabled_payments = ["bca_va", "bni_va", "bri_va", "permata_va", "echannel"];
    } else if (paymentMethod === "e_wallet") {
      parameter.enabled_payments = ["gopay", "shopeepay"];
    } else if (paymentMethod === "cod") {
      parameter.enabled_payments = ["indomaret", "alfamart"];
    } else {
      // If not specified, enable all payment methods EXCEPT credit_card
      parameter.enabled_payments = [
        "gopay", "shopeepay",
        "bca_va", "bni_va", "bri_va", "permata_va", "echannel",
        "indomaret", "alfamart"
      ];
    }

    // If specific bank is selected for bank_transfer
    if (paymentMethod === "bank_transfer" && bankName) {
      const bankCode = bankName.toLowerCase();
      if (["bca", "bni", "bri", "permata"].includes(bankCode)) {
        parameter.enabled_payments = [`${bankCode}_va`];
      } else if (bankCode === "mandiri") {
        parameter.enabled_payments = ["echannel"];
      }
    }

    // Create Snap transaction token
    const snapResponse = await snap.createTransaction(parameter);

    // Create payment record
    const paymentId = nanoid();
    await db.insert(payment).values({
      id: paymentId,
      transactionId: transactionIds[0], // Link to first transaction if multiple
      paymentMethod: paymentMethod as any, // Cast to match schema enum
      paymentStatus: "pending",
      paymentDate: null,
      // Tambahan field untuk detail pembayaran
      bankName: bankName || "",
      vaNumber: "",
      billKey: "",
      billerCode: "",
      paymentCode: "",
      paymentInstructions: "",
      midtransOrderId: orderId,
      midtransTransactionId: "", // Will be filled after payment completion
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create notification for buyer
    await db.insert(notification).values({
      id: nanoid(),
      userId: buyerId,
      title: "Order Created",
      message: `Your order has been created. Please complete the payment.`,
      type: "transaction", // Using the appropriate enum value from schema
      linkTo: `/orders/${transactionIds[0]}`,
      createdAt: new Date(),
    });

    // Clear the cart after successful transaction creation
    for (const item of cartData.items) {
      await db.delete(cart).where(eq(cart.id, item.id));
    }

    // Return the necessary data including Snap token
    return {
      success: true,
      transactionIds,
      orderId,
      paymentMethod,
      token: snapResponse.token,
      redirect_url: snapResponse.redirect_url,
    };
  } catch (error) {
    console.error("Error creating transaction:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create transaction",
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

    const { 
      order_id, 
      transaction_status, 
      fraud_status, 
      payment_type,
      transaction_id,
      va_numbers,
      permata_va_number,
      bill_key,
      biller_code,
      payment_code,
      expiry_time
    } = body;

    // Extract transaction IDs from your database using order_id
    // Pertama, cari payment record berdasarkan midtransOrderId
    const paymentRecord = await db.query.payment.findFirst({
      where: eq(payment.midtransOrderId, order_id),
    });

    if (!paymentRecord) {
      return { success: false, error: "No matching payment record found" };
    }

    // Sekarang dapatkan transaksi terkait
    const relatedTransactions = await db.query.transaction.findMany({
      where: eq(transaction.id, paymentRecord.transactionId),
    });

    // If no transactions found, return error
    if (relatedTransactions.length === 0) {
      return { success: false, error: "No matching transactions found" };
    }

    // Map the Midtrans status to our schema's payment status
    // Match transaction_status to values from our schema enum
    let paymentStatus = "pending";
    let orderStatus = "processing";

    // Process based on transaction_status
    if (
      transaction_status === "capture" ||
      transaction_status === "settlement"
    ) {
      if (fraud_status === "accept") {
        paymentStatus = "settlement"; // Using the appropriate enum value
      }
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      paymentStatus = transaction_status; // Using the appropriate enum value
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

    // Update payment details (penting: simpan informasi detail pembayaran)
    let bankNameValue = paymentRecord.bankName;
    let vaNumberValue = paymentRecord.vaNumber;
    let billKeyValue = paymentRecord.billKey;
    let billerCodeValue = paymentRecord.billerCode;
    let paymentCodeValue = paymentRecord.paymentCode;

    // Update jika ada informasi baru dari callback
    if (va_numbers && va_numbers.length > 0) {
      bankNameValue = va_numbers[0].bank;
      vaNumberValue = va_numbers[0].va_number;
    } else if (permata_va_number) {
      bankNameValue = "permata";
      vaNumberValue = permata_va_number;
    }

    if (bill_key) {
      billKeyValue = bill_key;
    }

    if (biller_code) {
      billerCodeValue = biller_code;
    }

    if (payment_code) {
      paymentCodeValue = payment_code;
    }

    // Update all related transactions
    for (const tx of relatedTransactions) {
      // Update transaction status
      await db
        .update(transaction)
        .set({
          paymentStatus: paymentStatus as any, // Cast to match schema enum
          orderStatus: orderStatus as any, // Cast to match schema enum
          updatedAt: new Date(),
        })
        .where(eq(transaction.id, tx.id));

      // Update payment records with more details
      await db
        .update(payment)
        .set({
          paymentStatus: paymentStatus as any, // Cast to match schema enum
          paymentDate: new Date(),
          bankName: bankNameValue,
          vaNumber: vaNumberValue,
          billKey: billKeyValue,
          billerCode: billerCodeValue,
          paymentCode: paymentCodeValue,
          midtransTransactionId: transaction_id || paymentRecord.midtransTransactionId,
          updatedAt: new Date(),
        })
        .where(eq(payment.id, paymentRecord.id));

      // Create notifications
      // For buyer
      await db.insert(notification).values({
        id: nanoid(),
        userId: tx.buyerId,
        title:
          paymentStatus === "settlement" ? "Payment Successful" : "Payment Failed",
        message:
          paymentStatus === "settlement"
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
        title: paymentStatus === "settlement" ? "Payment Received" : "Payment Failed",
        message:
          paymentStatus === "settlement"
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
// Fungsi untuk mendapatkan detail pembayaran berdasarkan ID transaksi
export async function getPaymentDetails(transactionId: string) {
  try {
    const paymentDetails = await db.query.payment.findFirst({
      where: eq(payment.transactionId, transactionId),
    });

    if (!paymentDetails) {
      return {
        success: false,
        error: "Payment details not found",
      };
    }

    return {
      success: true,
      data: {
        ...paymentDetails,
        paymentInstructions: paymentDetails.paymentInstructions
          ? JSON.parse(paymentDetails.paymentInstructions)
          : {},
      },
    };
  } catch (error) {
    console.error("Error getting payment details:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get payment details",
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
            images: true,
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
            eq(transaction.orderStatus, status as any) // Cast to match schema enum
          ),
        with: {
          product: {
            with: {
              images: true,
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
            images: true,
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
            eq(transaction.orderStatus, status as any) // Cast to match schema enum
          ),
        with: {
          product: {
            with: {
              images: true,
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