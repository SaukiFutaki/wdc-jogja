/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { ProductFormValues } from "./db/schema.zod";
import { db } from "./db/db";
import { product, productToCategory } from "./db/schema";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

/**
 * Server action untuk membuat produk baru
 */
export async function createProduct(data: ProductFormValues) {
  try {
    const productId = uuidv4();
    const now = new Date();

    // Insert produk baru ke database
    await db.insert(product).values({
      id: productId,
      name: data.name,
      description: data.description || null,
      sku: data.sku || null,
      barcode: data.barcode || null,
      price: data.price,
      costPrice: data.costPrice || null,
      salePrice: data.salePrice || null,
      stockQuantity: data.stockQuantity || 0,
      weight: data.weight || null,
      dimensions: data.dimensions || null,
      image: data.image || null,
      isActive: data.isActive,
      createdAt: now,
      updatedAt: now,
      //   createdById: data.cr || null, // Asumsi user ID tersedia dari session
    });

    // Jika kategori dipilih, tambahkan relasi produk-kategori
    if (data.categoryId) {
      await db.insert(productToCategory).values({
        productId: productId,
        categoryId: data.categoryId,
        createdAt: now,
      });
    }

    // Revalidasi cache untuk path produk
    revalidatePath("/products");

    return {
      success: true,
      message: "Produk berhasil disimpan",
      productId,
    };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      success: false,
      message: `Gagal menyimpan produk: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      error,
    };
  }
}

/**
 * Server action untuk mengupdate produk yang sudah ada
 */
export async function updateProduct(
  productId: string,
  data: ProductFormValues
) {
  try {
    const now = new Date();

    // Update data produk
    await db
      .update(product)
      .set({
        name: data.name,
        description: data.description || null,
        sku: data.sku || null,
        barcode: data.barcode || null,
        price: data.price,
        costPrice: data.costPrice || null,
        salePrice: data.salePrice || null,
        stockQuantity: data.stockQuantity || 0,
        weight: data.weight || null,
        dimensions: data.dimensions || null,
        image: data.image || null,
        isActive: data.isActive,
        updatedAt: now,
      })
      .where(eq(product.id, productId));

    // Jika kategori diubah, update relasi
    if (data.categoryId) {
      // Hapus relasi yang ada
      await db
        .delete(productToCategory)
        .where(eq(productToCategory.productId, productId));

      // Tambahkan relasi baru
      await db.insert(productToCategory).values({
        productId: productId,
        categoryId: data.categoryId,
        createdAt: now,
      });
    }

    // Revalidasi cache untuk path produk
    revalidatePath("/products");
    revalidatePath(`/products/${productId}`);

    return {
      success: true,
      message: "Produk berhasil diperbarui",
      productId,
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      success: false,
      message: `Gagal memperbarui produk: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      error,
    };
  }
}
/**
 * Server action untuk menghapus produk
 */
export async function deleteProduct(productId: string) {
  try {
    // Hapus produk
    await db.delete(product).where(eq(product.id, productId));

    // Hapus relasi produk-kategori
    await db
      .delete(productToCategory)
      .where(eq(productToCategory.productId, productId));

    // Revalidasi cache untuk path produk
    revalidatePath("/products");

    return {
      success: true,
      message: "Produk berhasil dihapus",
    };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      message: `Gagal menghapus produk: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      error,
    };
  }
}

// /**
//  * Server action untuk mengambil produk berdasarkan ID
//  */
// export async function getProductById(productId: string) {
//     try {
//         const productData = await db.select().from(product).where(eq(product.id, productId)).get(); 
    
//         if (!productData) {
//             return {
//                 success: false,
//                 message: "Produk tidak ditemukan",
//             };
//         }
    
//         return {
//             success: true,
//             product: productData,
//         };
//     } catch (error) {
//         console.error("Error fetching product:", error);
//         return {
//             success: false,
//             message: `Gagal mengambil data produk: ${
//                 error instanceof Error ? error.message : "Unknown error"
//             }`,
//         };
//     }
// }


// /**
//  * Server action untuk mengambil semua produk
//  */
// export async function getAllProducts(options?: {
//   limit?: number;
//   offset?: number;
//   search?: string;
//   categoryId?: string;
//   isActive?: boolean;
// }) {
//   try {
//     let query = db.select().from(product);

//     // Filter berdasarkan opsi yang diberikan
//     if (options?.search) {
//       query = query.where(product.name.like(`%${options.search}%`));
//     }

//     if (options?.categoryId) {
//       query = query.where(
//         product.id.in(
//           db
//             .select(productToCategory.productId)
//             .from(productToCategory)
//             .where(productToCategory.categoryId === options.categoryId)
//         )
//       );
//     }

//     if (options?.isActive !== undefined) {
//       query = query.where(product.isActive === options.isActive);
//     }

//     // Pagination
//     if (options?.limit) {
//       query = query.limit(options.limit);

//       if (options?.offset) {
//         query = query.offset(options.offset);
//       }
//     }

//     const products = await query;

//     // Hitung total untuk pagination
//     const countQuery = await db
//       .select({ count: db.fn.count(product.id) })
//       .from(product);

//     const totalCount = Number(countQuery[0].count);

//     return {
//       success: true,
//       products,
//       totalCount,
//     };
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return {
//       success: false,
//       message: `Gagal mengambil data produk: ${
//         error instanceof Error ? error.message : "Unknown error"
//       }`,
//     };
//   }
// }

// /**
//  * Redirect ke halaman produk dengan aksi create/update/delete
//  */
// export async function productAction(formData: FormData) {
//   const action = formData.get("action") as string;

//   if (action === "create") {
//     // Konversi FormData ke objek ProductFormValues
//     const data: Partial<ProductFormValues> = {
//       name: formData.get("name") as string,
//       description: formData.get("description") as string,
//       sku: formData.get("sku") as string,
//       barcode: formData.get("barcode") as string,
//       price: Number(formData.get("price")),
//       costPrice: formData.get("costPrice")
//         ? Number(formData.get("costPrice"))
//         : undefined,
//       salePrice: formData.get("salePrice")
//         ? Number(formData.get("salePrice"))
//         : undefined,
//       stockQuantity: Number(formData.get("stockQuantity")),
//       weight: formData.get("weight")
//         ? Number(formData.get("weight"))
//         : undefined,
//       dimensions: formData.get("dimensions") as string,
//       image: formData.get("image") as string,
//       isActive: formData.get("isActive") === "true",
//       categoryId: formData.get("categoryId") as string,
//     };

//     const result = await createProduct(data as ProductFormValues);

//     if (result.success) {
//       redirect("/products");
//     } else {
//       // Dalam kasus error, kita bisa menyimpan error message dalam cookies atau session
//       // dan menampilkannya di halaman form
//       console.error(result.message);
//       // Kembali ke halaman form
//       redirect("/products/new?error=" + encodeURIComponent(result.message));
//     }
//   } else if (action === "update") {
//     const productId = formData.get("id") as string;

//     // Konversi FormData ke objek ProductFormValues
//     const data: Partial<ProductFormValues> = {
//       name: formData.get("name") as string,
//       description: formData.get("description") as string,
//       sku: formData.get("sku") as string,
//       barcode: formData.get("barcode") as string,
//       price: Number(formData.get("price")),
//       costPrice: formData.get("costPrice")
//         ? Number(formData.get("costPrice"))
//         : undefined,
//       salePrice: formData.get("salePrice")
//         ? Number(formData.get("salePrice"))
//         : undefined,
//       stockQuantity: Number(formData.get("stockQuantity")),
//       weight: formData.get("weight")
//         ? Number(formData.get("weight"))
//         : undefined,
//       dimensions: formData.get("dimensions") as string,
//       image: formData.get("image") as string,
//       isActive: formData.get("isActive") === "true",
//       categoryId: formData.get("categoryId") as string,
//     };

//     const result = await updateProduct(productId, data as ProductFormValues);

//     if (result.success) {
//       redirect("/products");
//     } else {
//       // Handle error
//       redirect(
//         `/products/${productId}/edit?error=${encodeURIComponent(
//           result.message
//         )}`
//       );
//     }
//   } else if (action === "delete") {
//     const productId = formData.get("id") as string;

//     const result = await deleteProduct(productId);

//     if (result.success) {
//       redirect("/products");
//     } else {
//       // Handle error
//       redirect(`/products?error=${encodeURIComponent(result.message)}`);
//     }
//   }

//   // Jika action tidak dikenali
//   redirect("/products");
// }
