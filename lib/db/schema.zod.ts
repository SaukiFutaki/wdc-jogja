import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(3, {
      message: "Nama produk harus minimal 3 karakter.",
    }),
    description: z.string().optional(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    price: z.coerce.number().positive({
      message: "Harga harus lebih dari 0.",
    }),
    costPrice: z.coerce.number().positive().optional(),
    salePrice: z.coerce.number().positive().optional(),
    stockQuantity: z.coerce.number().int().nonnegative().default(0),
    weight: z.coerce.number().positive().optional(),
    dimensions: z.string().optional(),
    image: z.string().optional(),
    isActive: z.boolean().default(true),
    categoryId: z.string().optional(),
  });

  export type ProductFormValues = z.infer<typeof productSchema>;