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



  export const loginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  });

  export type LoginFormValues = z.infer<typeof loginSchema>;

  // Register form schema
 export const registerSchema = z
    .object({
      name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters" }),
      email: z
        .string()
        .email({ message: "Please enter a valid email address" }),
      password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
      confirmPassword: z
        .string()
        .min(6, { message: "Please confirm your password" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  export type RegisterFormValues = z.infer<typeof registerSchema>;