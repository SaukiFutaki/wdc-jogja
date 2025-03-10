// "use server";

// import { auth } from "@/auth";
// import { headers } from "next/headers";
// import { db } from "../db/db";
// import { transaction, product, user, payment, shipping } from "../db/schema";
// import { and, desc, eq, sql } from "drizzle-orm";
// import { revalidatePath } from "next/cache";

// // Get all purchases for the current user (buyer)
// export async function getUserPurchases() {
//   try {
//     const session = await auth.api.getSession({
//       headers: await headers(),
//     });
//     if (!session?.user?.id) {
//       return { success: false, error: "Unauthorized" };
//     }

//     const purchases = await db
//       .select({
//         transaction: transaction,
//         product: product,
//         seller: {
//           id: user.id,
//           name: user.name,
//           email: user.email,
//           image: user.image,
//         },
//         payment: payment,
//         shipping: shipping,
//       })
//       .from(transaction)
//       .innerJoin(product, eq(transaction.productId, product.id))
//       .innerJoin(user, eq(transaction.sellerId, user.id))
//       .leftJoin(payment, eq(transaction.id, payment.transactionId))
//       .leftJoin(shipping, eq(transaction.id, shipping.transactionId))
//       .where(eq(transaction.buyerId, session.user.id))
//       .orderBy(desc(transaction.createdAt));

//     return { success: true, purchases };
//   } catch (error) {
//     console.error("Failed to fetch user purchases:", error);
//     return { success: false, error: "Failed to fetch user purchases" };
//   }
// }

// // Get all sales for the current user (seller)
// export async function getUserSales() {
//   try {
//     const session = await auth.api.getSession({
//       headers: await headers(),
//     });
//     if (!session?.user?.id) {
//       return { success: false, error: "Unauthorized" };
//     }

//     const sales = await db
//       .select({
//         transaction: transaction,
//         product: product,
//         buyer: {
//           id: user.id,
//           name: user.name,
//           email: user.email,
//           image: user.image,
//         },
//         payment: payment,
//         shipping: shipping,
//       })
//       .from(transaction)
//       .innerJoin(product, eq(transaction.productId, product.id))
//       .innerJoin(user, eq(transaction.buyerId, user.id))
//       .leftJoin(payment, eq(transaction.id, payment.transactionId))
//       .leftJoin(shipping, eq(transaction.id, shipping.transactionId))
//       .where(eq(transaction.sellerId, session.user.id))
//       .orderBy(desc(transaction.createdAt));

//     return { success: true, sales };
//   } catch (error) {
//     console.error("Failed to fetch user sales:", error);
//     return { success: false, error: "Failed to fetch user sales" };
//   }
// }

// // Get transaction details by ID (accessible to buyer or seller only)
// export async function getTransactionById(transactionId: string) {
//   try {
//     const session = await auth.api.getSession({
//       headers: await headers(),
//     });
//     if (!session?.user?.id) {
//       return { success: false, error: "Unauthorized" };
//     }

//     const transactionDetails = await db
//       .select({
//         transaction: transaction,
//         product: product,
//         buyer: {
//           id: user.id,
//           name: user.name,
//           email: user.email,
//           image: user.image,
//           phone: user.phone,
//           address: user.address,
//           city: user.city,
//           postalCode: user.postalCode,
//         },
//         seller: {
//           id: sql<string>`seller.id`,
//           name: sql<string>`seller.name`,
//           email: sql<string>`seller.email`,
//           image: sql<string>`seller.image`,
//           phone: sql<string>`seller.phone`,
//         },
//         payment: payment,
//         shipping: shipping,
//       })
//       .from(transaction)
//       .innerJoin(product, eq(transaction.productId, product.id))
//       .innerJoin(
//         user.as("buyer"),
//         eq(transaction.buyerId, sql<string>`buyer.id`)
//       )
//       .innerJoin(
//         user.as("seller"),
//         eq(transaction.sellerId, sql<string>`seller.id`)
//       )
//       .leftJoin(payment, eq(transaction.id, payment.transactionId))
//       .leftJoin(shipping, eq(transaction.id, shipping.transactionId))
//       .where(
//         and(
//           eq(transaction.id, transactionId),
//           sql`(${transaction.buyerId} = ${session.user.id} OR ${transaction.sellerId} = ${session.user.id})`
//         )
//       );

//     if (!transactionDetails || transactionDetails.length === 0) {
//       return {
//         success: false,
//         error: "Transaction not found or you don't have access",
//       };
//     }

//     return { success: true, transaction: transactionDetails[0] };
//   } catch (error) {
//     console.error("Failed to fetch transaction details:", error);
//     return { success: false, error: "Failed to fetch transaction details" };
//   }
// }

// // Update order status (seller only)
// export async function updateOrderStatus({
//   transactionId,
//   status,
// }: {
//   transactionId: string;
//   status: "processing" | "shipped" | "delivered" | "canceled";
// }) {
//   try {
//     const session = await auth.api.getSession({
//       headers: await headers(),
//     });
//     if (!session?.user?.id) {
//       return { success: false, error: "Unauthorized" };
//     }

//     // Verify the user is the seller for this transaction
//     const existingTransaction = await db
//       .select()
//       .from(transaction)
//       .where(
//         and(
//           eq(transaction.id, transactionId),
//           eq(transaction.sellerId, session.user.id)
//         )
//       );

//     if (existingTransaction.length === 0) {
//       return {
//         success: false,
//         error: "Transaction not found or you are not the seller",
//       };
//     }

//     // Update transaction status
//     await db
//       .update(transaction)
//       .set({
//         orderStatus: status,
//         updatedAt: new Date(),
//       })
//       .where(eq(transaction.id, transactionId));

//     // If status is shipped, also update shipping information
//     if (status === "shipped") {
//       await db
//         .update(shipping)
//         .set({
//           shippingStatus: "shipped",
//           shippingDate: new Date(),
//           updatedAt: new Date(),
//         })
//         .where(eq(shipping.transactionId, transactionId));
//     } else if (status === "delivered") {
//       await db
//         .update(shipping)
//         .set({
//           shippingStatus: "delivered",
//           updatedAt: new Date(),
//         })
//         .where(eq(shipping.transactionId, transactionId));
//     }

//     // Create notification for the buyer
//     const buyer = await db
//       .select()
//       .from(user)
//       .where(eq(user.id, existingTransaction[0].buyerId));

//     if (buyer.length > 0) {
//       // Import and use createNotification function
//       const { createNotification } = await import("./notification-actions");
//       await createNotification({
//         userId: buyer[0].id,
//         title: `Order ${status}`,
//         message: `Your order #${transactionId.slice(0, 8)} has been ${status}`,
//         type: "transaction",
//         linkTo: `/transactions/${transactionId}`,
//       });
//     }

//     revalidatePath(`/transactions/${transactionId}`);
//     revalidatePath("/dashboard/seller/orders");
//     revalidatePath("/dashboard/purchases");
    
//     return { success: true };
//   } catch (error) {
//     console.error("Failed to update order status:", error);
//     return { success: false, error: "Failed to update order status" };
//   }
// }

// // Get monthly sales data for seller dashboard with platform comparison
// export async function getSellerMonthlySales() {
//   try {
//     const session = await auth.api.getSession({
//       headers: await headers(),
//     });
//     if (!session?.user?.id) {
//       return { success: false, error: "Unauthorized" };
//     }

//     // Get the date for 12 months ago
//     const twelveMonthsAgo = new Date();
//     twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

//     // Use SQL to aggregate monthly sales with device information
//     const monthlyData = await db.query(
//       sql`
//       SELECT 
//         strftime('%Y-%m', datetime(${transaction.createdAt} / 1000, 'unixepoch')) as month,
//         COUNT(*) as totalOrders,
//         SUM(${transaction.totalPrice}) as totalRevenue,
//         SUM(CASE WHEN ${transaction.deviceType} = 'desktop' THEN 1 ELSE 0 END) as desktop,
//         SUM(CASE WHEN ${transaction.deviceType} = 'mobile' THEN 1 ELSE 0 END) as mobile
//       FROM ${transaction}
//       WHERE ${transaction.sellerId} = ${session.user.id}
//         AND ${transaction.createdAt} >= ${twelveMonthsAgo.getTime()}
//         AND ${transaction.paymentStatus} = 'settlement'
//       GROUP BY strftime('%Y-%m', datetime(${transaction.createdAt} / 1000, 'unixepoch'))
//       ORDER BY month ASC
//     `
//     );

//     // Format data for chart display
//     const formattedData = monthlyData.map((item) => {
//       // Extract month name from YYYY-MM format
//       const date = new Date(item.month + '-01');
//       const monthName = date.toLocaleString('default', { month: 'long' });
      
//       return {
//         month: monthName,
//         desktop: item.desktop || 0,
//         mobile: item.mobile || 0,
//         totalOrders: item.totalOrders,
//         totalRevenue: item.totalRevenue
//       };
//     });

//     // Get last 6 months data for recent trends
//     const recentMonthsData = formattedData.slice(-6);

//     return { 
//       success: true, 
//       monthlySales: formattedData,
//       recentMonthsData
//     };
//   } catch (error) {
//     console.error("Failed to fetch monthly sales data:", error);
//     return { success: false, error: "Failed to fetch monthly sales data" };
//   }
// }

// // Get sales summary for seller dashboard
// export async function getSellerSalesSummary() {
//   try {
//     const session = await auth.api.getSession({
//       headers: await headers(),
//     });
//     if (!session?.user?.id) {
//       return { success: false, error: "Unauthorized" };
//     }

//     // Total completed sales
//     const completedSales = await db
//       .select({ count: sql<number>`count(*)` })
//       .from(transaction)
//       .where(
//         and(
//           eq(transaction.sellerId, session.user.id),
//           eq(transaction.orderStatus, "delivered"),
//           eq(transaction.paymentStatus, "settlement")
//         )
//       );

//     // Total pending orders
//     const pendingOrders = await db
//       .select({ count: sql<number>`count(*)` })
//       .from(transaction)
//       .where(
//         and(
//           eq(transaction.sellerId, session.user.id),
//           sql`${transaction.orderStatus} IN ('processing', 'shipped')`,
//           eq(transaction.paymentStatus, "settlement")
//         )
//       );

//     // Total revenue
//     const revenue = await db
//       .select({ total: sql<number>`SUM(${transaction.totalPrice})` })
//       .from(transaction)
//       .where(
//         and(
//           eq(transaction.sellerId, session.user.id),
//           eq(transaction.paymentStatus, "settlement")
//         )
//       );

//     // Active product listings
//     const activeListings = await db
//       .select({ count: sql<number>`count(*)` })
//       .from(product)
//       .where(
//         and(
//           eq(product.sellerId, session.user.id),
//           eq(product.status, "available")
//         )
//       );

//     // Calculate month-over-month growth
//     const currentMonth = new Date();
//     const previousMonth = new Date();
//     previousMonth.setMonth(previousMonth.getMonth() - 1);
    
//     const currentMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
//     const previousMonthStart = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1);
//     const previousMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
    
//     // Current month revenue
//     const currentMonthRevenue = await db
//       .select({ total: sql<number>`SUM(${transaction.totalPrice})` })
//       .from(transaction)
//       .where(
//         and(
//           eq(transaction.sellerId, session.user.id),
//           eq(transaction.paymentStatus, "settlement"),
//           sql`${transaction.createdAt} >= ${currentMonthStart.getTime()}`
//         )
//       );
    
//     // Previous month revenue
//     const previousMonthRevenue = await db
//       .select({ total: sql<number>`SUM(${transaction.totalPrice})` })
//       .from(transaction)
//       .where(
//         and(
//           eq(transaction.sellerId, session.user.id),
//           eq(transaction.paymentStatus, "settlement"),
//           sql`${transaction.createdAt} >= ${previousMonthStart.getTime()}`,
//           sql`${transaction.createdAt} <= ${previousMonthEnd.getTime()}`
//         )
//       );
    
//     // Calculate growth rate
//     const currentRev = currentMonthRevenue[0].total || 0;
//     const prevRev = previousMonthRevenue[0].total || 0;
//     const revenueGrowth = prevRev > 0 
//       ? Number((((currentRev - prevRev) / prevRev) * 100).toFixed(1))
//       : 0;

//     // Get best selling products
//     const bestSellingProducts = await db
//       .select({
//         id: product.id,
//         name: product.name,
//         category: product.category,
//         price: product.price,
//         stock: product.stock,
//         image: product.images,
//         sold: sql<number>`COUNT(${transaction.id})`,
//       })
//       .from(product)
//       .leftJoin(transaction, eq(product.id, transaction.productId))
//       .where(eq(product.sellerId, session.user.id))
//       .groupBy(product.id)
//       .orderBy(desc(sql<number>`COUNT(${transaction.id})`))
//       .limit(5);

//     // Format product data
//     const formattedProducts = bestSellingProducts.map(product => ({
//       id: product.id,
//       name: product.name,
//       category: product.category,
//       price: `$${product.price.toFixed(2)}`,
//       stock: product.stock,
//       sold: product.sold,
//       image: product.image && product.image.length > 0 ? product.image[0] : null,
//     }));

//     // Get recent orders
//     const recentOrders = await db
//       .select({
//         id: transaction.id,
//         customer: user.name,
//         customerEmail: user.email,
//         customer_image: user.image,
//         date: transaction.createdAt,
//         amount: transaction.totalPrice,
//         status: transaction.orderStatus,
//         items: product.quantity,
//       })
//       .from(transaction)
//       .innerJoin(user, eq(transaction.buyerId, user.id))
//       .innerJoin(product, eq(transaction.productId, product.id))
//       .where(eq(transaction.sellerId, session.user.id))
//       .orderBy(desc(transaction.createdAt))
//       .limit(5);

//     // Format recent orders
//     const formattedOrders = recentOrders.map(order => ({
//       id: order.id.substring(0, 8).toUpperCase(),
//       customer: order.customer,
//       customerEmail: order.customerEmail,
//       date: new Date(order.date).toISOString().split('T')[0],
//       amount: `$${order.amount.toFixed(2)}`,
//       status: order.status,
//       items: order.items,
//       customer_image: order.customer_image,
//     }));

//     return {
//       success: true,
//       summary: {
//         completedSales: completedSales[0].count || 0,
//         pendingOrders: pendingOrders[0].count || 0,
//         totalRevenue: revenue[0].total || 0,
//         revenueGrowth: revenueGrowth,
//         activeListings: activeListings[0].count || 0,
//       },
//       bestSellingProducts: formattedProducts,
//       recentOrders: formattedOrders
//     };
//   } catch (error) {
//     console.error("Failed to fetch sales summary:", error);
//     return { success: false, error: "Failed to fetch sales summary" };
//   }
// }

// // Get user retention data
// export async function getUserRetentionData() {
//   try {
//     const session = await auth.api.getSession({
//       headers: await headers(),
//     });
//     if (!session?.user?.id) {
//       return { success: false, error: "Unauthorized" };
//     }

//     // This is a complex query that would typically fetch cohort data
//     // For demonstration, we're creating sample retention data
//     // In a real application, you would query your database for actual cohort analysis
    
//     const cohortData = [
//       {
//         "cohort": "Jan",
//         "month0": 100,
//         "month1": 88.8,
//         "month2": 79.5, 
//         "month3": 74.2,
//         "month4": 68.2,
//         "month5": 65.4,
//         "month6": 59.4,
//         "totalUsers": 2854
//       },
//       {
//         "cohort": "Feb",
//         "month0": 100,
//         "month1": 89.2,
//         "month2": 80.6,
//         "month3": 72.1,
//         "month4": 65.3,
//         "month5": 62.3,
//         "month6": 55.7,
//         "totalUsers": 2960
//       },
//       {
//         "cohort": "Mar",
//         "month0": 100,
//         "month1": 87.5,
//         "month2": 78.1,
//         "month3": 70.3,
//         "month4": 67.8,
//         "month5": 63.1,
//         "month6": 57.2,
//         "totalUsers": 3102
//       },
//       {
//         "cohort": "Apr",
//         "month0": 100,
//         "month1": 91.2,
//         "month2": 82.4,
//         "month3": 75.7,
//         "month4": 69.5,
//         "month5": 64.8,
//         "month6": 60.3,
//         "totalUsers": 3250
//       },
//       {
//         "cohort": "May",
//         "month0": 100,
//         "month1": 90.5,
//         "month2": 81.2,
//         "month3": 73.8,
//         "month4": 68.9,
//         "month5": 65.1,
//         "month6": 61.4,
//         "totalUsers": 3178
//       },
//       {
//         "cohort": "Jun",
//         "month0": 100,
//         "month1": 92.3,
//         "month2": 84.1,
//         "month3": 76.9,
//         "month4": 71.2,
//         "month5": 68.4,
//         "month6": 63.8,
//         "totalUsers": 3420
//       }
//     ];

//     return { success: true, retentionData: cohortData };
//   } catch (error) {
//     console.error("Failed to fetch user retention data:", error);
//     return { success: false, error: "Failed to fetch user retention data" };
//   }
// }

// // Get device usage statistics
// export async function getDeviceUsageStats() {
//   try {
//     const session = await auth.api.getSession({
//       headers: await headers(),
//     });
//     if (!session?.user?.id) {
//       return { success: false, error: "Unauthorized" };
//     }

//     // Again, in a real application you would query your database
//     // Here we're creating sample data for the charts
    
//     const barData = [
//       { name: "Jan", desktop: 2400, mobile: 2000 },
//       { name: "Feb", desktop: 3200, mobile: 3800 },
//       { name: "Mar", desktop: 2800, mobile: 2600 },
//       { name: "Apr", desktop: 2000, mobile: 1800 },
//       { name: "May", desktop: 3600, mobile: 3200 },
//       { name: "Jun", desktop: 2800, mobile: 2400 }
//     ];

//     const returningRateData = [
//       { name: "Jan", rate1: 30, rate2: 20 },
//       { name: "Feb", rate1: 45, rate2: 35 },
//       { name: "Mar", rate1: 55, rate2: 40 },
//       { name: "Apr", rate1: 40, rate2: 45 },
//       { name: "May", rate1: 50, rate2: 50 },
//       { name: "Jun", rate1: 52, rate2: 48 }
//     ];

//     return { 
//       success: true, 
//       deviceData: {
//         barData,
//         returningRateData
//       }
//     };
//   } catch (error) {
//     console.error("Failed to fetch device usage stats:", error);
//     return { success: false, error: "Failed to fetch device usage stats" };
//   }
// }