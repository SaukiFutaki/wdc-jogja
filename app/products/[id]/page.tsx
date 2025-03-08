import ProductImageGallery from "@/components/products/(id)/product-image-gallery";
import ProductQuantitySelector from "@/components/products/(id)/product-quantity-selector";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProductById } from "@/lib/actions/product";
import { Star } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface IPageProps {
  params: Promise<{ id: string }>;
}
export default async function Page({ params }: IPageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product.data) {
    return notFound();
  }
  return (
    <div className="mx-32">
      <div className="min-h-screen mt-24">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem >
                <BreadcrumbLink  aria-disabled >
                  {product.data?.category}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {product.data?.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Suspense
              fallback={
                <div className="bg-gray-100 rounded-lg aspect-square animate-pulse" />
              }
            >
              <ProductImageGallery
                images={
                  product.data?.images?.map((img) => ({
                    id: img.id,
                    prductId: img.productId,
                    cloudinaryId: img.cloudinaryId,
                    cloudinaryUrl: img.cloudinaryUrl,
                  })) || []
                }
              />
            </Suspense>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.data?.name}</h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-orange-500 text-orange-500"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  ({product.data?.sustainabilityRating})
                </span>
              </div>

              <div className="text-2xl font-bold mb-4">
                {product.data?.quantity}
              </div>

              <p className="text-gray-600 mb-6">{product.data?.description}</p>

              {/* Color Selection - Client Component */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Select Colors</h3>
                {/* <ProductColorSelector colors={product.colors} /> */}
              </div>

              {/* Size Selection - Client Component */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Choose Size</h3>
                {/* <ProductSizeSelector sizes={product.sizes} /> */}
              </div>

              {/* Quantity and Add to Cart - Client Components */}

              <ProductQuantitySelector
                maxQuantity={product.data?.quantity ?? undefined}
                productId={product.data?.id || ""}
              />
            </div>
          </div>

          {/* Product Details and Reviews */}
          <div className="mt-16">
            <Tabs defaultValue="details">
              <TabsList className="border-b w-full justify-start rounded-none">
                <TabsTrigger value="details">Product Details</TabsTrigger>
                <TabsTrigger value="reviews">Rating & Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="py-4">
                <div className="prose max-w-none">
                  <h3>Product Description</h3>
                  <p>{product.data?.description}</p>
                  <h3>Features</h3>
                  {/* <ul>
                  {product.details.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul> */}
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="py-4">
                {/* Reviews - Client Component */}
                {/* <ReviewList reviews={reviews} /> */}
              </TabsContent>
            </Tabs>
          </div>

          {/* You Might Also Like - Client Component */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">YOU MIGHT ALSO LIKE</h2>
            {/* <RelatedProducts products={relatedProducts} /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
