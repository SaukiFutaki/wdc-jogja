/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { sqliteTable, text, integer, real, primaryKey } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// ==================== USER MANAGEMENT ====================


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
  role: text("role").default("user"), // user, seller, rework_partner, waste_manager, admin
  sustainabilityScore: integer("sustainability_score").default(0),
});

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

export const userRelations = relations(user, ({ many }) => ({
  shops: many(shop),
  products: many(product),
  likes: many(like),
  comments: many(comment),
  cartItems: many(cartItem),
  orders: many(order),
  barterOffers: many(barterOffer),
  reworkRequests: many(reworkRequest),
  donations: many(donation),
  reviews: many(review),
}));



// ==================== SHOP/STORE MANAGEMENT ====================

export const shop = sqliteTable("shop", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  logo: text("logo"),
  coverImage: text("cover_image"),
  address: text("address"),
  city: text("city"),
  postalCode: text("postal_code"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  socialMedia: text("social_media"), // JSON string
  isVerified: integer("is_verified", { mode: "boolean" }).default(false),
  sustainabilityCertified: integer("sustainability_certified", { mode: "boolean" }).default(false),
  ownerId: text("owner_id").notNull().references(() => user.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const shopRelations = relations(shop, ({ one, many }) => ({
  owner: one(user, { fields: [shop.ownerId], references: [user.id] }),
  products: many(product),
  followers: many(shopFollower),
}));

export const shopFollower = sqliteTable("shop_follower", {
  id: text("id").primaryKey(),
  shopId: text("shop_id").notNull().references(() => shop.id),
  userId: text("user_id").notNull().references(() => user.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const shopFollowerRelations = relations(shopFollower, ({ one }) => ({
  shop: one(shop, { fields: [shopFollower.shopId], references: [shop.id] }),
  user: one(user, { fields: [shopFollower.userId], references: [user.id] }),
}));

// ==================== PRODUCT MANAGEMENT ====================

// Define the type to break circular dependency
export type ProductCategoryTable = typeof productCategory;

export const productCategory = sqliteTable("product_category", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  parentId: text("parent_id").references((): any => productCategory.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const productCategoryRelations = relations(productCategory, ({ one, many }) => ({
  parent: one(productCategory, { fields: [productCategory.parentId], references: [productCategory.id] }),
  children: many(productCategory),
  products: many(productToCategory),
}));

export const product = sqliteTable("product", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  condition: text("condition").notNull(), // new, like_new, good, fair, poor
  brand: text("brand"),
  size: text("size"),
  color: text("color"),
  material: text("material"),
  gender: text("gender"), // men, women, unisex, kids
  sku: text("sku").unique(),
  barcode: text("barcode"),
  price: real("price").notNull(),
  salePrice: real("sale_price"),
  stockQuantity: integer("stock_quantity").default(1),
  weight: real("weight"),
  dimensions: text("dimensions"), // JSON string: {"length": 10, "width": 5, "height": 2}
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  isSustainable: integer("is_sustainable", { mode: "boolean" }).default(false),
  sustainabilityInfo: text("sustainability_info"),
  availableForBarter: integer("available_for_barter", { mode: "boolean" }).default(false),
  barterValue: real("barter_value"),
  availableForRework: integer("available_for_rework", { mode: "boolean" }).default(false),
  createdById: text("created_by_id").notNull().references(() => user.id),
  shopId: text("shop_id").references(() => shop.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const productRelations = relations(product, ({ one, many }) => ({
  createdBy: one(user, { fields: [product.createdById], references: [user.id] }),
  shop: one(shop, { fields: [product.shopId], references: [shop.id] }),
  categories: many(productToCategory),
  images: many(productImage),
  variants: many(productVariant),
  likes: many(like),
  comments: many(comment),
  cartItems: many(cartItem),
  barterOffers: many(barterOffer),
  orderItems: many(orderItem),
}));

export const productToCategory = sqliteTable("product_to_category", {
  productId: text("product_id").notNull().references(() => product.id),
  categoryId: text("category_id").notNull().references(() => productCategory.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.productId, t.categoryId] }),
}));

export const productToCategoryRelations = relations(productToCategory, ({ one }) => ({
  product: one(product, { fields: [productToCategory.productId], references: [product.id] }),
  category: one(productCategory, { fields: [productToCategory.categoryId], references: [productCategory.id] }),
}));

export const productImage = sqliteTable("product_image", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => product.id),
  url: text("url").notNull(),
  alt: text("alt"),
  isPrimary: integer("is_primary", { mode: "boolean" }).default(false),
  order: integer("order").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const productImageRelations = relations(productImage, ({ one }) => ({
  product: one(product, { fields: [productImage.productId], references: [product.id] }),
}));

export const productVariant = sqliteTable("product_variant", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => product.id),
  name: text("name").notNull(),
  attributes: text("attributes"), // JSON string: {"color": "red", "size": "L"}
  sku: text("sku").unique(),
  price: real("price"),
  stockQuantity: integer("stock_quantity").default(0),
  image: text("image"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const productVariantRelations = relations(productVariant, ({ one }) => ({
  product: one(product, { fields: [productVariant.productId], references: [product.id] }),
}));

// ==================== SOCIAL FEATURES ====================

export const like = sqliteTable("like", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  productId: text("product_id").notNull().references(() => product.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const likeRelations = relations(like, ({ one }) => ({
  user: one(user, { fields: [like.userId], references: [user.id] }),
  product: one(product, { fields: [like.productId], references: [product.id] }),
}));

// Define the type to break circular dependency
export type CommentTable = typeof comment;

export const comment = sqliteTable("comment", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  userId: text("user_id").notNull().references(() => user.id),
  productId: text("product_id").notNull().references(() => product.id),
  parentId: text("parent_id").references((): any => comment.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const commentRelations = relations(comment, ({ one, many }) => ({
  user: one(user, { fields: [comment.userId], references: [user.id] }),
  product: one(product, { fields: [comment.productId], references: [product.id] }),
  parent: one(comment, { fields: [comment.parentId], references: [comment.id] }),
  replies: many(comment),
}));

// ==================== CART & ORDER MANAGEMENT ====================

export const cartItem = sqliteTable("cart_item", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  productId: text("product_id").notNull().references(() => product.id),
  variantId: text("variant_id").references(() => productVariant.id),
  quantity: integer("quantity").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const cartItemRelations = relations(cartItem, ({ one }) => ({
  user: one(user, { fields: [cartItem.userId], references: [user.id] }),
  product: one(product, { fields: [cartItem.productId], references: [product.id] }),
  variant: one(productVariant, { fields: [cartItem.variantId], references: [productVariant.id] }),
}));

export const order = sqliteTable("order", {
  id: text("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  userId: text("user_id").notNull().references(() => user.id),
  status: text("status").notNull(), // pending, processing, shipped, delivered, cancelled, refunded
  subtotal: real("subtotal").notNull(),
  shippingCost: real("shipping_cost").notNull(),
  discount: real("discount").default(0),
  tax: real("tax").default(0),
  total: real("total").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  shippingCity: text("shipping_city").notNull(),
  shippingPostalCode: text("shipping_postal_code").notNull(),
  shippingMethod: text("shipping_method").notNull(),
  paymentMethod: text("payment_method").notNull(),
  paymentStatus: text("payment_status").notNull(), // pending, paid, failed, refunded
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const orderRelations = relations(order, ({ one, many }) => ({
  user: one(user, { fields: [order.userId], references: [user.id] }),
  items: many(orderItem),
  payments: many(payment),
}));

export const orderItem = sqliteTable("order_item", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => order.id),
  productId: text("product_id").notNull().references(() => product.id),
  variantId: text("variant_id").references(() => productVariant.id),
  quantity: integer("quantity").notNull(),
  pricePerUnit: real("price_per_unit").notNull(),
  discount: real("discount").default(0),
  total: real("total").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const orderItemRelations = relations(orderItem, ({ one }) => ({
  order: one(order, { fields: [orderItem.orderId], references: [order.id] }),
  product: one(product, { fields: [orderItem.productId], references: [product.id] }),
  variant: one(productVariant, { fields: [orderItem.variantId], references: [productVariant.id] }),
}));

export const payment = sqliteTable("payment", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => order.id),
  amount: real("amount").notNull(),
  method: text("method").notNull(), // credit_card, bank_transfer, e-wallet, etc.
  status: text("status").notNull(), // pending, success, failed
  transactionId: text("transaction_id"),
  paymentDetails: text("payment_details"), // JSON string
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const paymentRelations = relations(payment, ({ one }) => ({
  order: one(order, { fields: [payment.orderId], references: [order.id] }),
}));

// ==================== BARTER SYSTEM ====================

export const barterOffer = sqliteTable("barter_offer", {
  id: text("id").primaryKey(),
  offererId: text("offerer_id").notNull().references(() => user.id),
  receiverId: text("receiver_id").notNull().references(() => user.id),
  offeredProductId: text("offered_product_id").notNull().references(() => product.id),
  requestedProductId: text("requested_product_id").notNull().references(() => product.id),
  status: text("status").notNull(), // pending, accepted, rejected, cancelled
  message: text("message"),
  additionalCash: real("additional_cash").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const barterOfferRelations = relations(barterOffer, ({ one }) => ({
  offerer: one(user, { fields: [barterOffer.offererId], references: [user.id] }),
  receiver: one(user, { fields: [barterOffer.receiverId], references: [user.id] }),
  offeredProduct: one(product, { fields: [barterOffer.offeredProductId], references: [product.id] }),
  requestedProduct: one(product, { fields: [barterOffer.requestedProductId], references: [product.id] }),
}));

// ==================== REWORK SERVICE ====================

export const reworkPartner = sqliteTable("rework_partner", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  businessName: text("business_name").notNull(),
  description: text("description"),
  expertise: text("expertise"), // JSON array: ["alteration", "upcycling", "repair"]
  portfolio: text("portfolio"), // JSON array of image URLs
  rating: real("rating"),
  isVerified: integer("is_verified", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const reworkPartnerRelations = relations(reworkPartner, ({ one, many }) => ({
  user: one(user, { fields: [reworkPartner.userId], references: [user.id] }),
  services: many(reworkService),
  requests: many(reworkRequest),
}));

export const reworkService = sqliteTable("rework_service", {
  id: text("id").primaryKey(),
  partnerId: text("partner_id").notNull().references(() => reworkPartner.id),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // alteration, upcycling, repair, custom
  basePrice: real("base_price").notNull(),
  estimatedDays: integer("estimated_days").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const reworkServiceRelations = relations(reworkService, ({ one, many }) => ({
  partner: one(reworkPartner, { fields: [reworkService.partnerId], references: [reworkPartner.id] }),
  requests: many(reworkRequest),
}));

export const reworkRequest = sqliteTable("rework_request", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  partnerId: text("partner_id").notNull().references(() => reworkPartner.id),
  serviceId: text("service_id").notNull().references(() => reworkService.id),
  description: text("description").notNull(),
  images: text("images"), // JSON array of image URLs
  status: text("status").notNull(), // pending, accepted, in_progress, completed, rejected, cancelled
  price: real("price"),
  completionDate: integer("completion_date", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const reworkRequestRelations = relations(reworkRequest, ({ one }) => ({
  user: one(user, { fields: [reworkRequest.userId], references: [user.id] }),
  partner: one(reworkPartner, { fields: [reworkRequest.partnerId], references: [reworkPartner.id] }),
  service: one(reworkService, { fields: [reworkRequest.serviceId], references: [reworkService.id] }),
}));

// ==================== DONATION & RECYCLING ====================

export const wasteManager = sqliteTable("waste_manager", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  organizationName: text("organization_name").notNull(),
  description: text("description"),
  acceptableItems: text("acceptable_items"), // JSON array: ["clothing", "textiles", "accessories"]
  isVerified: integer("is_verified", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const wasteManagerRelations = relations(wasteManager, ({ one, many }) => ({
  user: one(user, { fields: [wasteManager.userId], references: [user.id] }),
  donations: many(donation),
}));

export const donation = sqliteTable("donation", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  managerId: text("manager_id").notNull().references(() => wasteManager.id),
  description: text("description"),
  itemTypes: text("item_types"), // JSON array: ["clothing", "shoes", "accessories"]
  estimatedWeight: real("estimated_weight"),
  itemCount: integer("item_count"),
  images: text("images"), // JSON array of image URLs
  status: text("status").notNull(), // pending, accepted, collected, processed
  pickupAddress: text("pickup_address"),
  pickupDate: integer("pickup_date", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const donationRelations = relations(donation, ({ one }) => ({
  user: one(user, { fields: [donation.userId], references: [user.id] }),
  manager: one(wasteManager, { fields: [donation.managerId], references: [wasteManager.id] }),
}));

// ==================== EDUCATION & SUSTAINABILITY ====================

export const article = sqliteTable("article", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  coverImage: text("cover_image"),
  authorId: text("author_id").notNull().references(() => user.id),
  status: text("status").notNull(), // draft, published, archived
  views: integer("views").default(0),
  tags: text("tags"), // JSON array
  publishedAt: integer("published_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const articleRelations = relations(article, ({ one, many }) => ({
  author: one(user, { fields: [article.authorId], references: [user.id] }),
  comments: many(articleComment),
}));

// Define the type to break circular dependency
export type ArticleCommentTable = typeof articleComment;

export const articleComment = sqliteTable("article_comment", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  userId: text("user_id").notNull().references(() => user.id),
  articleId: text("article_id").notNull().references(() => article.id),
  parentId: text("parent_id").references((): any => articleComment.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const articleCommentRelations = relations(articleComment, ({ one, many }) => ({
  user: one(user, { fields: [articleComment.userId], references: [user.id] }),
  article: one(article, { fields: [articleComment.articleId], references: [article.id] }),
  parent: one(articleComment, { fields: [articleComment.parentId], references: [articleComment.id] }),
  replies: many(articleComment, { relationName: "parent" }),
}));

export const sustainabilityChallenge = sqliteTable("sustainability_challenge", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  rules: text("rules").notNull(),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }).notNull(),
  reward: text("reward"),
  createdById: text("created_by_id").notNull().references(() => user.id),
  status: text("status").notNull(), // upcoming, active, completed
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const sustainabilityChallengeRelations = relations(sustainabilityChallenge, ({ one, many }) => ({
  createdBy: one(user, { fields: [sustainabilityChallenge.createdById], references: [user.id] }),
  participants: many(challengeParticipant),
}));

export const challengeParticipant = sqliteTable("challenge_participant", {
  id: text("id").primaryKey(),
  challengeId: text("challenge_id").notNull().references(() => sustainabilityChallenge.id),
  userId: text("user_id").notNull().references(() => user.id),
  status: text("status").notNull(), // joined, in_progress, completed, disqualified
  progress: integer("progress").default(0),
  proofImages: text("proof_images"), // JSON array of image URLs
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const challengeParticipantRelations = relations(challengeParticipant, ({ one }) => ({
  challenge: one(sustainabilityChallenge, { fields: [challengeParticipant.challengeId], references: [sustainabilityChallenge.id] }),
  user: one(user, { fields: [challengeParticipant.userId], references: [user.id] }),
}));

// ==================== REVIEW & RATING ====================

export const review = sqliteTable("review", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  rating: integer("rating").notNull(), // 1-5
  content: text("content"),
  images: text("images"), // JSON array of image URLs
  // Reference one of these IDs based on review type
  productId: text("product_id").references(() => product.id),
  shopId: text("shop_id").references(() => shop.id),
  reworkPartnerId: text("rework_partner_id").references(() => reworkPartner.id),
  wasteManagerId: text("waste_manager_id").references(() => wasteManager.id),
  // End of optional references
  status: text("status").notNull(), // pending, approved, rejected
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const reviewRelations = relations(review, ({ one }) => ({
  user: one(user, { fields: [review.userId], references: [user.id] }),
  product: one(product, { fields: [review.productId], references: [product.id] }),
  shop: one(shop, { fields: [review.shopId], references: [shop.id] }),
  reworkPartner: one(reworkPartner, { fields: [review.reworkPartnerId], references: [reworkPartner.id] }),
  wasteManager: one(wasteManager, { fields: [review.wasteManagerId], references: [wasteManager.id] }),
}));

// ==================== NOTIFICATION SYSTEM ====================

export const notification = sqliteTable("notification", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  type: text("type").notNull(), // order_status, message, like, comment, barter_offer, etc.
  title: text("title").notNull(),
  content: text("content").notNull(),
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  data: text("data"), // JSON string with additional data based on notification type
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const notificationRelations = relations(notification, ({ one }) => ({
  user: one(user, { fields: [notification.userId], references: [user.id] }),
}));

// ==================== MESSAGING SYSTEM ====================

export const conversation = sqliteTable("conversation", {
  id: text("id").primaryKey(),
  title: text("title"),
  isGroup: integer("is_group", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const conversationRelations = relations(conversation, ({ many }) => ({
  participants: many(conversationParticipant),
  messages: many(message),
}));

export const conversationParticipant = sqliteTable("conversation_participant", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id").notNull().references(() => conversation.id),
  userId: text("user_id").notNull().references(() => user.id),
  isAdmin: integer("is_admin", { mode: "boolean" }).default(false),
  joinedAt: integer("joined_at", { mode: "timestamp" }).notNull(),
  leftAt: integer("left_at", { mode: "timestamp" }),
});
export const conversationParticipantRelations = relations(conversationParticipant, ({ one }) => ({
  conversation: one(conversation, { fields: [conversationParticipant.conversationId], references: [conversation.id] }),
  user: one(user, { fields: [conversationParticipant.userId], references: [user.id] }),
}));

export const message = sqliteTable("message", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id").notNull().references(() => conversation.id),
  senderId: text("sender_id").notNull().references(() => user.id),
  content: text("content").notNull(),
  attachments: text("attachments"), // JSON array of attachment URLs
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  readBy: text("read_by"), // JSON array of user IDs
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const messageRelations = relations(message, ({ one }) => ({
  conversation: one(conversation, { fields: [message.conversationId], references: [conversation.id] }),
  sender: one(user, { fields: [message.senderId], references: [user.id] }),
}));

// ==================== REPORTING SYSTEM ====================

export const report = sqliteTable("report", {
  id: text("id").primaryKey(),
  reporterId: text("reporter_id").notNull().references(() => user.id),
  reason: text("reason").notNull(),
  description: text("description"),
  evidence: text("evidence"), // JSON array of evidence (urls, screenshots, etc.)
  status: text("status").notNull(), // pending, reviewing, resolved, dismissed
  // Reference one of these IDs based on what's being reported
  userId: text("user_id").references(() => user.id),
  productId: text("product_id").references(() => product.id),
  shopId: text("shop_id").references(() => shop.id),
  commentId: text("comment_id").references(() => comment.id),
  reviewId: text("review_id").references(() => review.id),
  // End of optional references
  adminNotes: text("admin_notes"),
  resolvedById: text("resolved_by_id").references(() => user.id),
  resolvedAt: integer("resolved_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const reportRelations = relations(report, ({ one }) => ({
  reporter: one(user, { fields: [report.reporterId], references: [user.id] }),
  reportedUser: one(user, { fields: [report.userId], references: [user.id] }),
  reportedProduct: one(product, { fields: [report.productId], references: [product.id] }),
  reportedShop: one(shop, { fields: [report.shopId], references: [shop.id] }),
  reportedComment: one(comment, { fields: [report.commentId], references: [comment.id] }),
  reportedReview: one(review, { fields: [report.reviewId], references: [review.id] }),
  resolvedBy: one(user, { fields: [report.resolvedById], references: [user.id] }),
}));

// ==================== SHIPPING & LOGISTICS ====================

export const shippingMethod = sqliteTable("shipping_method", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  provider: text("provider").notNull(),
  baseCost: real("base_cost").notNull(),
  estimatedDays: text("estimated_days").notNull(), // "1-2", "3-5", etc.
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  sustainabilityRating: integer("sustainability_rating").default(0), // 1-5 rating for eco-friendly shipping
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const shipment = sqliteTable("shipment", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => order.id),
  trackingNumber: text("tracking_number"),
  shippingMethodId: text("shipping_method_id").notNull().references(() => shippingMethod.id),
  status: text("status").notNull(), // pending, shipped, in_transit, delivered, failed
  estimatedDelivery: integer("estimated_delivery", { mode: "timestamp" }),
  actualDelivery: integer("actual_delivery", { mode: "timestamp" }),
  shippingProof: text("shipping_proof"), // URL to shipping label or proof
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const shipmentRelations = relations(shipment, ({ one }) => ({
  order: one(order, { fields: [shipment.orderId], references: [order.id] }),
  shippingMethod: one(shippingMethod, { fields: [shipment.shippingMethodId], references: [shippingMethod.id] }),
}));

// ==================== ANALYTICS & TRACKING ====================

export const userActivity = sqliteTable("user_activity", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  activityType: text("activity_type").notNull(), // login, product_view, search, purchase, etc.
  details: text("details"), // JSON string with activity details
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const userActivityRelations = relations(userActivity, ({ one }) => ({
  user: one(user, { fields: [userActivity.userId], references: [user.id] }),
}));

export const searchQuery = sqliteTable("search_query", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => user.id),
  query: text("query").notNull(),
  filters: text("filters"), // JSON string of applied filters
  resultCount: integer("result_count"),
  sessionId: text("session_id"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const searchQueryRelations = relations(searchQuery, ({ one }) => ({
  user: one(user, { fields: [searchQuery.userId], references: [user.id] }),
}));

// ==================== WISHLIST ====================

export const wishlist = sqliteTable("wishlist", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  name: text("name").notNull(),
  isPublic: integer("is_public", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const wishlistRelations = relations(wishlist, ({ one, many }) => ({
  user: one(user, { fields: [wishlist.userId], references: [user.id] }),
  items: many(wishlistItem),
}));

export const wishlistItem = sqliteTable("wishlist_item", {
  id: text("id").primaryKey(),
  wishlistId: text("wishlist_id").notNull().references(() => wishlist.id),
  productId: text("product_id").notNull().references(() => product.id),
  variantId: text("variant_id").references(() => productVariant.id),
  addedAt: integer("added_at", { mode: "timestamp" }).notNull(),
  notes: text("notes"),
});

export const wishlistItemRelations = relations(wishlistItem, ({ one }) => ({
  wishlist: one(wishlist, { fields: [wishlistItem.wishlistId], references: [wishlist.id] }),
  product: one(product, { fields: [wishlistItem.productId], references: [product.id] }),
  variant: one(productVariant, { fields: [wishlistItem.variantId], references: [productVariant.id] }),
}));

// ==================== ADMIN DASHBOARD & SETTINGS ====================

export const systemSetting = sqliteTable("system_setting", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  type: text("type").notNull(), // string, number, boolean, json
  category: text("category").notNull(), // general, payment, shipping, etc.
  description: text("description"),
  updatedById: text("updated_by_id").references(() => user.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const systemSettingRelations = relations(systemSetting, ({ one }) => ({
  updatedBy: one(user, { fields: [systemSetting.updatedById], references: [user.id] }),
}));

export const adminLog = sqliteTable("admin_log", {
  id: text("id").primaryKey(),
  adminId: text("admin_id").notNull().references(() => user.id),
  action: text("action").notNull(),
  details: text("details"),
  entity: text("entity").notNull(), // user, product, order, etc.
  entityId: text("entity_id"),
  ipAddress: text("ip_address"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const adminLogRelations = relations(adminLog, ({ one }) => ({
  admin: one(user, { fields: [adminLog.adminId], references: [user.id] }),
}));

// ==================== SUSTAINABILITY METRICS ====================

export const sustainabilityMetric = sqliteTable("sustainability_metric", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => user.id),
  shopId: text("shop_id").references(() => shop.id),
  metricType: text("metric_type").notNull(), // carbon_saved, waste_diverted, water_saved, etc.
  value: real("value").notNull(),
  unit: text("unit").notNull(), // kg, liters, etc.
  source: text("source").notNull(), // purchase, donation, rework, etc.
  sourceId: text("source_id"), // ID of the related entity
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const sustainabilityMetricRelations = relations(sustainabilityMetric, ({ one }) => ({
  user: one(user, { fields: [sustainabilityMetric.userId], references: [user.id] }),
  shop: one(shop, { fields: [sustainabilityMetric.shopId], references: [shop.id] }),
}));

// ==================== DISCOUNT & COUPON SYSTEM ====================

export const coupon = sqliteTable("coupon", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description"),
  discountType: text("discount_type").notNull(), // percentage, fixed_amount
  discountValue: real("discount_value").notNull(),
  minimumPurchase: real("minimum_purchase").default(0),
  maximumDiscount: real("maximum_discount"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").default(0),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }),
  applicableTo: text("applicable_to"), // JSON: {"products": [...], "categories": [...], "shops": [...]}
  createdById: text("created_by_id").notNull().references(() => user.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const couponRelations = relations(coupon, ({ one, many }) => ({
  createdBy: one(user, { fields: [coupon.createdById], references: [user.id] }),
  usage: many(couponUsage),
}));

export const couponUsage = sqliteTable("coupon_usage", {
  id: text("id").primaryKey(),
  couponId: text("coupon_id").notNull().references(() => coupon.id),
  userId: text("user_id").notNull().references(() => user.id),
  orderId: text("order_id").notNull().references(() => order.id),
  discountAmount: real("discount_amount").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const couponUsageRelations = relations(couponUsage, ({ one }) => ({
  coupon: one(coupon, { fields: [couponUsage.couponId], references: [coupon.id] }),
  user: one(user, { fields: [couponUsage.userId], references: [user.id] }),
  order: one(order, { fields: [couponUsage.orderId], references: [order.id] }),
}));