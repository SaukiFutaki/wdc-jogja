/* eslint-disable @typescript-eslint/no-unused-vars */
// ProductPage.tsx (Server Component)
import ProductActions from "@/components/products/product-action";
import ProductCard from "@/components/products/product-card";
import ProductImageGallery from "@/components/products/product-image-gallery";
import ReviewSection from "@/components/products/review-section";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star } from "lucide-react";

interface IPageProps {
  params: Promise<{ id: string }>;
}

// This data would typically come from a database or API
const getProductData = () => {
  return {
    id: "checkered-shirt-001",
    name: "CHECKERED SHIRT",
    price: "Rp 150.000",
    rating: 5,
    reviewCount: 93,
    description:
      "This premium t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.",
    images: [
      "/checkered-shirt.png",
      "/checkered-shirt.png",
      "/checkered-shirt.png",
    ],
    colors: [
      { name: "navy", class: "bg-navy-600" },
      { name: "red", class: "bg-red-600" },
      { name: "brown", class: "bg-brown-600" },
    ],
    sizes: ["Small", "Medium", "Large", "X Large"],
    details: {
      description:
        "Our Checkered Shirt is crafted from premium cotton blend fabric, ensuring both comfort and durability. The classic checkered pattern makes it versatile for both casual and semi-formal occasions.",
      features: [
        "Premium cotton blend fabric",
        "Regular fit",
        "Button-down collar",
        "Long sleeves with button cuffs",
        "Machine washable",
      ],
    },
  };
};

const getReviews = () => {
  return [
    {
      name: "Daniel P.",
      rating: 4.5,
      date: "February 28, 2025",
      content:
        "Kualitas bajunya bagus sekali dan nyaman dipakai! Barang jahitan rapi dan tidak luntur.",
    },
    {
      name: "Ethan W.",
      rating: 4,
      date: "February 25, 2025",
      content:
        "Suka banget fit nya! Jenis bahan bermutu, sesuai gambar. Jahitan rapi dan harganya worth it!",
    },
    {
      name: "Kusuma",
      rating: 4,
      date: "February 28, 2025",
      content:
        "Kualitas oke banget sih dan sesuai, cuma bahannya berasa agak tipis. Tapi overall jahitannya rapi, recommended banget!",
    },
  ];
};

const getRelatedProducts = () => {
  return [
    {
      title: "Polo with Contrast Trims",
      price: "Rp 140.000",
      image: "/polo-contrast.png",
      rating: 4.5,
      reviewCount: 42,
    },
    {
      title: "Gradient Graphic T-shirt",
      price: "Rp 120.000",
      image: "/gradient-tee.png",
      rating: 4.8,
      reviewCount: 37,
    },
    {
      title: "Polo with Taping Details",
      price: "Rp 145.000",
      image: "/polo-tape.png",
      rating: 4.6,
      reviewCount: 28,
    },
    {
      title: "Black Striped T-shirt",
      price: "Rp 130.000",
      image: "/striped-tshirt.png",
      rating: 4.7,
      reviewCount: 45,
    },
  ];
};

export default async function Page({ params }: IPageProps) {
  const { id } = await params;
  const product = getProductData();
  const reviews = getReviews();
  const relatedProducts = getRelatedProducts();

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">
                Product
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Images - Client Component */}
          <ProductImageGallery images={product.images} />

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

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
                ({product.reviewCount})
              </span>
            </div>

            <div className="text-2xl font-bold mb-4">{product.price}</div>

            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Client Component for Product Actions */}
            <ProductActions colors={product.colors} sizes={product.sizes} />
          </div>
        </div>

        {/* Product Details and Reviews */}
        <div className="mt-16">
          <Tabs defaultValue="reviews">
            <TabsList className="border-b w-full justify-start rounded-none">
              <TabsTrigger value="details">Product Details</TabsTrigger>
              <TabsTrigger value="reviews">Rating & Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="py-4">
              <div className="prose max-w-none">
                <h3>Product Description</h3>
                <p>{product.details.description}</p>
                <h3>Features</h3>
                <ul>
                  {product.details.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="py-4">
              <ReviewSection reviews={reviews} />
            </TabsContent>
          </Tabs>
        </div>

        {/* You Might Also Like */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">YOU MIGHT ALSO LIKE</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* {relatedProducts.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))} */}
          </div>
        </div>
      </div>
    </div>
  );
}
