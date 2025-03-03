import * as z from "zod"


//  id: text("id").primaryKey(),
//   sellerId: text("seller_id")
//     .notNull()
//     .references(() => user.id),
//   name: text("name").notNull(),
//   description: text("description"),
//   price: real("price"),
//   category: text("category"),
//   condition: text("condition", { enum: ["new", "used", "rework"] }).notNull(),
//   status: text("status", { enum: ["available", "sold", "barter"] }).default("available"),
//   sustainabilityRating: integer("sustainability_rating"),
//   createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
//   updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),


export const productSchema = z.object({
  id: z.string(), // Primary key
  sellerId: z.string().min(1, "Seller ID is required"), // Foreign key to user.id
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be a positive number").optional(),
  category: z.string().min(2, "Category name must be at least 2 characters"),
  condition: z.enum(["new", "used", "rework"]),
  status: z.enum(["available", "sold", "barter"]).default("available"),
  primaryImageUrl: z.string().optional(),
  sustainabilityRating: z.number().int().min(1, "Sustainability rating must be at least 1").optional(),
  createdAt: z.date(), // Timestamp
  updatedAt: z.date(), // Timestamp
});




export type ProductFormValues = z.infer<typeof productSchema>


