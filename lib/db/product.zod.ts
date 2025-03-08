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
  id: z.string(), // Kunci utama
  sellerId: z.string().min(1, "ID Penjual wajib diisi"), // Kunci asing ke user.id
  name: z.string().min(2, "Nama produk harus memiliki minimal 2 karakter"),
  description: z.string().optional(),
  price: z.number().min(0, "Harga harus berupa angka positif").optional(),
  category: z.string().min(2, "Silakan pilih kategori yang valid").optional(),
  condition: z.enum(["new", "used", "rework"]).optional(),
  status: z.enum(["available", "sold", "barter"]).default("available").optional(),
  primaryImageUrl: z.string().optional(),
  quantity: z.number().int().min(1, "Jumlah minimal harus 1").optional(),
  discount: z.number().int().min(0, "Diskon minimal harus 0").optional(),
  sustainabilityRating: z.number().int().min(1, "Peringkat keberlanjutan minimal harus 1").optional(),
  createdAt: z.date(), // Timestamp
  updatedAt: z.date(), // Timestamp
  // Penjualan atau barter
  type: z.enum(["jual", "barter"]).optional(),
});





export type ProductFormValues = z.infer<typeof productSchema>


