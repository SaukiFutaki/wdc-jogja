import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// User table
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  bio: text("bio"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  postalCode: text("postal_code"),
  password: text("password"),
  role: text("role", {
    enum: ["user", "seller", "rework_partner", "waste_manager", "admin"],
  }).default("user"),
  sustainabilityScore: integer("sustainability_score").default(0),
});

// Authentication & session tables
export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const product = sqliteTable("product", {
  id: text("id").primaryKey(),
  sellerId: text("seller_id")
    .notNull()
    .references(() => user.id),
  name: text("name").notNull(),
  description: text("description"),
  price: real("price"),
  category: text("category"),
  quantity: integer("quantity").default(1),
  discount: real("discount").default(0),
  condition: text("condition", { enum: ["new", "used", "rework"] }).notNull(),
  status: text("status", { enum: ["available", "sold", "barter"] }).default(
    "available"
  ),
  primaryImageUrl: text("primary_image_url"), // Jika ingin menyimpan URL gambar utama
  sustainabilityRating: integer("sustainability_rating"),
  // jual atau barter
  type: text("type", { enum: ["jual", "barter"] }).default("jual"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Product images stored in Cloudinary
export const productImage = sqliteTable("product_image", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }), // Hapus gambar jika produk dihapus
  cloudinaryId: text("cloudinary_id").notNull(),
  cloudinaryUrl: text("cloudinary_url").notNull(),
  isPrimary: integer("is_primary", { mode: "boolean" }).default(false), // Gunakan false sebagai default
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Barter system
export const barterRequest = sqliteTable("barter_request", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  offeredProductId: text("offered_product_id")
    .notNull()
    .references(() => product.id),
  requestedProductId: text("requested_product_id")
    .notNull()
    .references(() => product.id),
  status: text("status", { enum: ["pending", "accepted", "rejected"] }).default(
    "pending"
  ),
  message: text("message"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Transaction system
export const transaction = sqliteTable("transaction", {
  id: text("id").primaryKey(),
  buyerId: text("buyer_id")
    .notNull()
    .references(() => user.id),
  sellerId: text("seller_id")
    .notNull()
    .references(() => user.id),
  productId: text("product_id")
    .notNull()
    .references(() => product.id),
  totalPrice: real("total_price").notNull(),
  paymentStatus: text("payment_status", {
    enum: [
      "pending",
      "settlement",
      "capture",
      "deny",
      "cancel",
      "expire",
      "refund",
      "partial_refund",
      "authorize",
    ],
  }).default("pending"),
  orderStatus: text("order_status", {
    enum: ["processing", "shipped", "delivered", "canceled"],
  }).default("processing"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Payment details
export const payment = sqliteTable("payment", {
  id: text("id").primaryKey(),
  transactionId: text("transaction_id")
    .notNull()
    .references(() => transaction.id),
  paymentMethod: text("payment_method", {
    enum: ["credit_card", "bank_transfer", "e_wallet", "cod"],
  }).notNull(),
  paymentStatus: text("payment_status", {
    enum: [
      "pending",
      "settlement",
      "capture",
      "deny",
      "cancel",
      "expire",
      "refund",
      "partial_refund",
      "authorize",
    ],
  }).default("pending"),
  paymentDate: integer("payment_date", { mode: "timestamp" }),
  // Tambahan field untuk menyimpan detail metode pembayaran
  bankName: text("bank_name"), // Nama bank (BCA, Mandiri, dll)
  vaNumber: text("va_number"), // Nomor Virtual Account
  billKey: text("bill_key"), // Untuk metode pembayaran tertentu seperti Mandiri Bill
  billerCode: text("biller_code"), // Untuk metode pembayaran tertentu
  paymentCode: text("payment_code"), // Untuk retail outlets seperti Alfamart/Indomaret
  paymentInstructions: text("payment_instructions"), // Instruksi pembayaran dalam JSON
  expiryTime: integer("expiry_time", { mode: "timestamp" }), // Waktu kadaluarsa pembayaran
  midtransOrderId: text("midtrans_order_id"), // Order ID dari Midtrans
  midtransTransactionId: text("midtrans_transaction_id"), // Transaction ID dari Midtrans
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Shipping details
export const shipping = sqliteTable("shipping", {
  id: text("id").primaryKey(),
  transactionId: text("transaction_id")
    .notNull()
    .references(() => transaction.id),
  shippingMethod: text("shipping_method").notNull(),
  trackingNumber: text("tracking_number"),
  shippingStatus: text("shipping_status", {
    enum: ["preparing", "shipped", "delivered"],
  }).default("preparing"),
  shippingDate: integer("shipping_date", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Rework service
export const reworkRequest = sqliteTable("rework_request", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  mitraId: text("mitra_id")
    .notNull()
    .references(() => user.id),
  productId: text("product_id").references(() => product.id),
  description: text("description"),
  status: text("status", {
    enum: ["pending", "in_progress", "completed", "canceled"],
  }).default("pending"),
  price: real("price"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Rework service images (before/after)
export const reworkImage = sqliteTable("rework_image", {
  id: text("id").primaryKey(),
  reworkRequestId: text("rework_request_id")
    .notNull()
    .references(() => reworkRequest.id),
  imageType: text("image_type", {
    enum: ["before", "after", "design"],
  }).notNull(),
  cloudflareId: text("cloudflare_id").notNull(),
  cloudflareUrl: text("cloudflare_url").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Donation & recycling
export const donation = sqliteTable("donation", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  recyclingPartnerId: text("recycling_partner_id").references(() => user.id),
  description: text("description"),
  itemCount: integer("item_count"),
  status: text("status", {
    enum: ["pending", "collected", "processed"],
  }).default("pending"),
  sustainabilityPoints: integer("sustainability_points").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Donation images
export const donationImage = sqliteTable("donation_image", {
  id: text("id").primaryKey(),
  donationId: text("donation_id")
    .notNull()
    .references(() => donation.id),
  cloudflareId: text("cloudflare_id").notNull(),
  cloudflareUrl: text("cloudflare_url").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Educational content
export const educationalContent = sqliteTable("educational_content", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  contentType: text("content_type", {
    enum: ["article", "video", "challenge"],
  }).notNull(),
  content: text("content"),
  authorId: text("author_id")
    .notNull()
    .references(() => user.id),
  thumbnailId: text("thumbnail_id"),
  thumbnailUrl: text("thumbnail_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Sustainable certification
export const sustainableCertification = sqliteTable(
  "sustainable_certification",
  {
    id: text("id").primaryKey(),
    sellerId: text("seller_id")
      .notNull()
      .references(() => user.id),
    certificationType: text("certification_type").notNull(),
    description: text("description"),
    status: text("status", {
      enum: ["pending", "approved", "rejected"],
    }).default("pending"),
    validUntil: integer("valid_until", { mode: "timestamp" }),
    certificateId: text("certificate_id"),
    certificateUrl: text("certificate_url"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  }
);

// User reviews
export const review = sqliteTable("review", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  productId: text("product_id").references(() => product.id),
  mitraId: text("mitra_id").references(() => user.id),
  rating: integer("rating").notNull(),
  reviewText: text("review_text"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Cart
export const cart = sqliteTable("cart", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  productId: text("product_id")
    .notNull()
    .references(() => product.id),
  quantity: integer("quantity").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Wishlist
export const wishlist = sqliteTable("wishlist", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  productId: text("product_id")
    .notNull()
    .references(() => product.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Notifications
export const notification = sqliteTable("notification", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  type: text("type", {
    enum: ["transaction", "barter", "rework", "system"],
  }).notNull(),
  linkTo: text("link_to"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Relations
export const userRelations = relations(user, ({ many }) => ({
  products: many(product),
  barterRequests: many(barterRequest),
  buyerTransactions: many(transaction, { relationName: "buyer" }),
  sellerTransactions: many(transaction, { relationName: "seller" }),
  reworkRequests: many(reworkRequest),
  donations: many(donation),
  reviews: many(review),
  carts: many(cart),
  wishlists: many(wishlist),
  notifications: many(notification),
  educationalContents: many(educationalContent),
  sustainableCertifications: many(sustainableCertification),
}));

export const productRelations = relations(product, ({ one, many }) => ({
  seller: one(user, {
    fields: [product.sellerId],
    references: [user.id],
  }),
  images: many(productImage),
  barterOffered: many(barterRequest, { relationName: "offered" }),
  barterRequested: many(barterRequest, { relationName: "requested" }),
  transactions: many(transaction),
  reviews: many(review),
  carts: many(cart),
  wishlists: many(wishlist),
}));

export const productImageRelations = relations(productImage, ({ one }) => ({
  product: one(product, {
    fields: [productImage.productId],
    references: [product.id],
  }),
}));

export const barterRequestRelations = relations(barterRequest, ({ one }) => ({
  user: one(user, {
    fields: [barterRequest.userId],
    references: [user.id],
  }),
  offeredProduct: one(product, {
    fields: [barterRequest.offeredProductId],
    references: [product.id],
    relationName: "offered",
  }),
  requestedProduct: one(product, {
    fields: [barterRequest.requestedProductId],
    references: [product.id],
    relationName: "requested",
  }),
}));

export const transactionRelations = relations(transaction, ({ one, many }) => ({
  buyer: one(user, {
    fields: [transaction.buyerId],
    references: [user.id],
    relationName: "buyer",
  }),
  seller: one(user, {
    fields: [transaction.sellerId],
    references: [user.id],
    relationName: "seller",
  }),
  product: one(product, {
    fields: [transaction.productId],
    references: [product.id],
  }),
  payment: many(payment),
  shipping: many(shipping),
}));

export const paymentRelations = relations(payment, ({ one }) => ({
  transaction: one(transaction, {
    fields: [payment.transactionId],
    references: [transaction.id],
  }),
}));

export const shippingRelations = relations(shipping, ({ one }) => ({
  transaction: one(transaction, {
    fields: [shipping.transactionId],
    references: [transaction.id],
  }),
}));

export const reworkRequestRelations = relations(
  reworkRequest,
  ({ one, many }) => ({
    user: one(user, {
      fields: [reworkRequest.userId],
      references: [user.id],
    }),
    mitra: one(user, {
      fields: [reworkRequest.mitraId],
      references: [user.id],
    }),
    product: one(product, {
      fields: [reworkRequest.productId],
      references: [product.id],
    }),
    images: many(reworkImage),
  })
);

export const reworkImageRelations = relations(reworkImage, ({ one }) => ({
  reworkRequest: one(reworkRequest, {
    fields: [reworkImage.reworkRequestId],
    references: [reworkRequest.id],
  }),
}));

export const donationRelations = relations(donation, ({ one, many }) => ({
  user: one(user, {
    fields: [donation.userId],
    references: [user.id],
  }),
  recyclingPartner: one(user, {
    fields: [donation.recyclingPartnerId],
    references: [user.id],
  }),
  images: many(donationImage),
}));

export const donationImageRelations = relations(donationImage, ({ one }) => ({
  donation: one(donation, {
    fields: [donationImage.donationId],
    references: [donation.id],
  }),
}));

export const educationalContentRelations = relations(
  educationalContent,
  ({ one }) => ({
    author: one(user, {
      fields: [educationalContent.authorId],
      references: [user.id],
    }),
  })
);

export const sustainableCertificationRelations = relations(
  sustainableCertification,
  ({ one }) => ({
    seller: one(user, {
      fields: [sustainableCertification.sellerId],
      references: [user.id],
    }),
  })
);

export const reviewRelations = relations(review, ({ one }) => ({
  user: one(user, {
    fields: [review.userId],
    references: [user.id],
  }),
  product: one(product, {
    fields: [review.productId],
    references: [product.id],
  }),
  mitra: one(user, {
    fields: [review.mitraId],
    references: [user.id],
  }),
}));

export const cartRelations = relations(cart, ({ one }) => ({
  user: one(user, {
    fields: [cart.userId],
    references: [user.id],
  }),
  product: one(product, {
    fields: [cart.productId],
    references: [product.id],
  }),
}));

export const wishlistRelations = relations(wishlist, ({ one }) => ({
  user: one(user, {
    fields: [wishlist.userId],
    references: [user.id],
  }),
  product: one(product, {
    fields: [wishlist.productId],
    references: [product.id],
  }),
}));

export const notificationRelations = relations(notification, ({ one }) => ({
  user: one(user, {
    fields: [notification.userId],
    references: [user.id],
  }),
}));
