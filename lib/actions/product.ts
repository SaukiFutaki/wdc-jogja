/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth } from "@/auth";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "../db/cloudinary";
import { db } from "../db/db";
import { ProductFormValues } from "../db/product.zod";
import { product, productImage } from "../db/schema";

/**
 * Upload a file to Cloudinary
 */
async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<{ secure_url: string; public_id: string }> {
  try {
    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = `data:${file.type};base64,${buffer.toString(
      "base64"
    )}`;

    // Upload to Cloudinary
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader.upload(
          base64String,
          { folder },
          (error, result) => {
            if (error) reject(error);
            else if (result) resolve(result);
            else reject(new Error("No result returned from Cloudinary"));
          }
        );
      }
    );

    return result;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload image");
  }
}

/**
 * Create a new product with images
 */
export async function createProduct(data: ProductFormValues, images?: File[]) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const productId = uuidv4();
    let primaryImageUrl = "";
    let uploadResults: any[] = [];

    // Handle image uploads if provided
    if (images && images.length > 0) {
      uploadResults = await Promise.all(
        images.map(async (image) => {
          const result = await uploadToCloudinary(
            image,
            `products/${productId}`
          );
          return result;
        })
      );

      // Set the first image as primary
      if (uploadResults.length > 0) {
        primaryImageUrl = uploadResults[0].secure_url;
      }
    }

    // First create the product with the primary image URL
    const [newProduct] = await db
      .insert(product)
      .values({
        id: productId,
        sellerId: session.user.id,
        name: data.name,
        description: data.description || "",
        price: data.price || 0,
        category: data.category || "",
        condition: data.condition || "used",
        quantity: data.quantity || 1,
        discount: data.discount || 0,
        status: data.status || "available",
        primaryImageUrl: primaryImageUrl, // Set the primary image URL
        sustainabilityRating: data.sustainabilityRating || 1,
        type: data.type || "jual",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Then create product image records AFTER the product exists
    if (uploadResults.length > 0) {
      await Promise.all(
        uploadResults.map(async (result, index) => {
          await db.insert(productImage).values({
            id: uuidv4(),
            productId: productId,
            cloudinaryId: result.public_id,
            cloudinaryUrl: result.secure_url,
            isPrimary: index === 0, // First image is primary
            createdAt: new Date(),
          });
        })
      );
    }

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product created successfully",
      data: newProduct,
    };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create product",
      error,
    };
  }
}


// get product top rating with limit
export async function getProductsTopRating(limit: number) {
  try {
    const products = await db
      .select()
      .from(product)
      .where(eq(product.type, "jual"))
      .orderBy(desc(product.sustainabilityRating))
      .limit(limit);
    return {
      success: true,
      data: products,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      message: "Failed to fetch products",
      error,
    };
  }
}
// export async function getProductsLimit(limit: number) {
//   try {
//     const products = await db
//       .select()
//       .from(product)
//       .where(eq(product.type, "jual"))
//       .orderBy(desc(product.createdAt))
//       .limit(limit);
//     return {
//       success: true,
//       data: products,
//     };
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return {
//       success: false,
//       message: "Failed to fetch products",
//       error,
//     };
//   }
// }

/**
 * Get all products
 */
export async function getAllProducts() {
  try {
    const products = await db
      .select()
      .from(product)
      .where(eq(product.type, "jual"))
      .orderBy(desc(product.createdAt));
    return {
      success: true,
      data: products,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      message: "Failed to fetch products",
      error,
    };
  }
}

export async function getAllProductsBarter() {
  try {
    const products = await db
      .select()
      .from(product)
      .where(eq(product.type, "barter"))
      .orderBy(desc(product.createdAt));
    return {
      success: true,
      data: products,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      message: "Failed to fetch products",
      error,
    };
  }
}

/**
 * Get all products by user
 */
export async function getAllProductsByUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Unauthorized",
      data: [],
    };
  }

  try {
    const products = await db
      .select()
      .from(product)
      .where(eq(product.sellerId, session.user.id))
      .orderBy(desc(product.createdAt));

    return {
      success: true,
      data: products,
    };
  } catch (error) {
    console.error("Error fetching user products:", error);
    return {
      success: false,
      message: "Failed to fetch user products",
      error,
    };
  }
}

/**
 * Get a product by ID with its images
 */
export async function getProductById(id: string) {
  try {
    const [productData] = await db
      .select()
      .from(product)
      .where(eq(product.id, id));

    if (!productData) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    const images = await db
      .select()
      .from(productImage)
      .where(eq(productImage.productId, id));

    return {
      success: true,
      data: {
        ...productData,
        images,
      },
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return {
      success: false,
      message: "Failed to fetch product",
      error,
    };
  }
}

/**
 * Update a product
 */
export async function updateProduct(
  id: string,
  data: Partial<ProductFormValues>,
  newImages?: File[]
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  try {
    // Check if product exists and belongs to user
    const [existingProduct] = await db
      .select()
      .from(product)
      .where(eq(product.id, id));

    if (!existingProduct) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    if (existingProduct.sellerId !== session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    let primaryImageUrl = existingProduct.primaryImageUrl;

    // Handle new image uploads if provided
    if (newImages && newImages.length > 0) {
      const uploadResults = await Promise.all(
        newImages.map(async (image) => {
          const result = await uploadToCloudinary(image, `products/${id}`);
          return result;
        })
      );

      // Get existing images to see if we need to set a new primary
      const existingImages = await db
        .select()
        .from(productImage)
        .where(eq(productImage.productId, id));

      const needNewPrimary = existingImages.length === 0;

      // Create product image records
      await Promise.all(
        uploadResults.map(async (result, index) => {
          await db.insert(productImage).values({
            id: uuidv4(),
            productId: id,
            cloudinaryId: result.public_id,
            cloudinaryUrl: result.secure_url,
            isPrimary: needNewPrimary && index === 0, // Set as primary if no images exist
            createdAt: new Date(),
          });

          // Update primary image URL if this is the first image and we need a new primary
          if (needNewPrimary && index === 0) {
            primaryImageUrl = result.secure_url;
          }
        })
      );
    }

    // Update the product
    const [updatedProduct] = await db
      .update(product)
      .set({
        ...data,
        primaryImageUrl,
        updatedAt: new Date(),
      })
      .where(eq(product.id, id))
      .returning();

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update product",
      error,
    };
  }
}

/**
 * Set an image as primary for a product
 */
export async function setProductPrimaryImage(
  productId: string,
  imageId: string
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  try {
    // Check if product exists and belongs to user
    const [existingProduct] = await db
      .select()
      .from(product)
      .where(eq(product.id, productId));

    if (!existingProduct) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    if (existingProduct.sellerId !== session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    // First, set all images for this product to not primary
    await db
      .update(productImage)
      .set({ isPrimary: false })
      .where(eq(productImage.productId, productId));

    // Set the selected image as primary
    const [updatedImage] = await db
      .update(productImage)
      .set({ isPrimary: true })
      .where(eq(productImage.id, imageId))
      .returning();

    if (!updatedImage) {
      return {
        success: false,
        message: "Image not found",
      };
    }

    // Update the product's primary image URL
    await db
      .update(product)
      .set({
        primaryImageUrl: updatedImage.cloudinaryUrl,
        updatedAt: new Date(),
      })
      .where(eq(product.id, productId));

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Primary image updated successfully",
    };
  } catch (error) {
    console.error("Error updating primary image:", error);
    return {
      success: false,
      message: "Failed to update primary image",
      error,
    };
  }
}

/**
 * Delete an image from a product
 */
export async function deleteProductImage(productId: string, imageId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  try {
    // Check if product exists and belongs to user
    const [existingProduct] = await db
      .select()
      .from(product)
      .where(eq(product.id, productId));

    if (!existingProduct) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    if (existingProduct.sellerId !== session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    // Get the image to delete
    const [imageToDelete] = await db
      .select()
      .from(productImage)
      .where(eq(productImage.id, imageId));

    if (!imageToDelete) {
      return {
        success: false,
        message: "Image not found",
      };
    }

    // Delete the image from Cloudinary
    if (imageToDelete.cloudinaryId) {
      await deleteFromCloudinary(imageToDelete.cloudinaryId);
    }

    // Delete the image record
    await db.delete(productImage).where(eq(productImage.id, imageId));

    // If this was the primary image, set a new primary image if any exist
    if (imageToDelete.isPrimary) {
      const [newPrimaryImage] = await db
        .select()
        .from(productImage)
        .where(eq(productImage.productId, productId))
        .limit(1);

      if (newPrimaryImage) {
        // Set this image as primary
        await db
          .update(productImage)
          .set({ isPrimary: true })
          .where(eq(productImage.id, newPrimaryImage.id));

        // Update the product's primary image URL
        await db
          .update(product)
          .set({
            primaryImageUrl: newPrimaryImage.cloudinaryUrl,
            updatedAt: new Date(),
          })
          .where(eq(product.id, productId));
      } else {
        // No images left, clear primary image URL
        await db
          .update(product)
          .set({
            primaryImageUrl: "",
            updatedAt: new Date(),
          })
          .where(eq(product.id, productId));
      }
    }

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Image deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting image:", error);
    return {
      success: false,
      message: "Failed to delete image",
      error,
    };
  }
}

/**
 * Delete a product and all its images
 */
export async function deleteProduct(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  try {
    // Check if product exists and belongs to user
    const [existingProduct] = await db
      .select()
      .from(product)
      .where(eq(product.id, id));

    if (!existingProduct) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    if (existingProduct.sellerId !== session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    // Get all images for this product
    const images = await db
      .select()
      .from(productImage)
      .where(eq(productImage.productId, id));

    // Delete all images from Cloudinary
    await Promise.all(
      images.map(async (image) => {
        if (image.cloudinaryId) {
          await deleteFromCloudinary(image.cloudinaryId);
        }
      })
    );

    // The product images will be automatically deleted due to the cascade delete
    // Delete the product
    await db.delete(product).where(eq(product.id, id));

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      message: "Failed to delete product",
      error,
    };
  }
}

/**
 * Update product status
 */
/**
 * Delete a file from Cloudinary
 */
async function deleteFromCloudinary(cloudinaryId: string) {
  try {
    // Call Cloudinary API to delete the image
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.destroy(cloudinaryId, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw new Error("Failed to delete image from Cloudinary");
  }
}


//condition rework
export async function getAllProductRework() {
  try {
    const products = await db
      .select()
      .from(product)
      .where(eq(product.condition, "rework"))
      .orderBy(desc(product.createdAt));
    return {
      success: true,
      data: products,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      message: "Failed to fetch products",
      error,
    };
  }
}