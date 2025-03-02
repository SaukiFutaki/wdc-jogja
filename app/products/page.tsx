/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronDown, ChevronRight, Heart } from "lucide-react";
import Image from "next/image";
  
export default function ShopPage() {
  return (
    <main className="min-h-screen">
      {/* Header - reusing from home page */}
   

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
      <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                Product
              </BreadcrumbPage>
            </BreadcrumbItem>
     
           
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium">Filters</h2>
                <button className="text-gray-500">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H15M6 12H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <FilterCategory name="T-shirts" />
                <FilterCategory name="Shorts" />
                <FilterCategory name="Shirts" />
                <FilterCategory name="Hoodie" />
                <FilterCategory name="Jeans" />
              </div>

              {/* Colors */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Colors</h3>
                  <ChevronDown size={16} />
                </div>
                <div className="grid grid-cols-5 gap-2">
                  <ColorButton color="bg-green-500" />
                  <ColorButton color="bg-red-500" />
                  <ColorButton color="bg-yellow-400" />
                  <ColorButton color="bg-orange-500" />
                  <ColorButton color="bg-sky-400" />
                  <ColorButton color="bg-blue-600" selected />
                  <ColorButton color="bg-purple-600" />
                  <ColorButton color="bg-pink-500" />
                  <ColorButton color="bg-white border border-gray-300" />
                  <ColorButton color="bg-black" />
                </div>
              </div>

              {/* Size */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Size</h3>
                  <ChevronDown size={16} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <SizeButton size="XX-Small" />
                  <SizeButton size="X-Small" />
                  <SizeButton size="Small" />
                  <SizeButton size="Medium" />
                  <SizeButton size="Large" selected />
                  <SizeButton size="X-Large" />
                  <SizeButton size="XX-Large" />
                  <SizeButton size="3X-Large" />
                  <SizeButton size="4X-Large" />
                </div>
              </div>

              {/* Dress Style */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Dress Style</h3>
                  <ChevronDown size={16} />
                </div>
                <FilterCategory name="Casual" />
                <FilterCategory name="Formal" />
                <FilterCategory name="Party" />
                <FilterCategory name="Gym" />
              </div>

              {/* Apply Filter Button */}
              <button className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition">
                Apply Filter
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-8">Shop</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Product 1 */}
              <ProductCard
                image="/skinny-jeans.png"
                title="Skinny Fit Jeans"
                price="Rp 150,000"
                originalPrice="Rp 170,000"
                discount={20}
                rating={5}
                reviewCount={88}
              />

              {/* Product 2 */}
              <ProductCard
                image="/checkered-shirt.png"
                title="Checkered Shirt"
                price="Rp 150,000"
                rating={5}
                reviewCount={68}
              />

              {/* Product 3 */}
              <ProductCard
                image="/striped-tshirt.png"
                title="Sleeve Striped T-Shirt"
                price="Rp 130,000"
                originalPrice="Rp 160,000"
                discount={20}
                rating={5}
                reviewCount={48}
              />

              {/* Product 4 */}
              <ProductCard
                image="/t-shirt-tape.png"
                title="T-Shirt With Tape Details"
                price="Rp 150,000"
                rating={5}
                reviewCount={88}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

// Helper Components
function FilterCategory({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-700">{name}</span>
      <ChevronRight size={16} className="text-gray-500" />
    </div>
  )
}

function ColorButton({ color, selected = false }: { color: string; selected?: boolean }) {
  return (
    <button
      className={`w-8 h-8 rounded-full ${color} ${selected ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
      aria-label="Select color"
    />
  )
}

function SizeButton({ size, selected = false }: { size: string; selected?: boolean }) {
  return (
    <button
      className={`py-1 px-2 text-xs rounded-md border ${
        selected ? "bg-black text-white border-black" : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
      }`}
    >
      {size}
    </button>
  )
}

function ProductCard({
  image,
  title,
  price,
  originalPrice,
  discount,
  rating,
  reviewCount,
}: {
  image: string
  title: string
  price: string
  originalPrice?: string
  discount?: number
  rating: number
  reviewCount: number
}) {
  return (
    <div className="group relative">
      <div className="relative bg-gray-100 rounded-lg overflow-hidden">
        {discount && (
          <div className="absolute top-2 left-2 bg-red-100 text-red-500 text-xs font-medium px-2 py-1 rounded-sm">
            -{discount}%
          </div>
        )}
        <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-sm z-10">
          <Heart className="w-5 h-5 text-gray-500" />
        </button>
        <Image
          src={image.startsWith("/") ? image : `/placeholder.svg?height=400&width=300`}
          alt={title}
          width={300}
          height={400}
          className="w-full h-[300px] object-cover transition-transform group-hover:scale-105"
        />
      </div>

      <div className="mt-3">
        <h3 className="font-medium">{title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-medium text-orange-500">{price}</span>
          {originalPrice && <span className="text-gray-500 line-through text-sm">{originalPrice}</span>}
        </div>
        <div className="flex items-center mt-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 text-orange-500 fill-orange-500" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">({reviewCount})</span>
        </div>
      </div>
    </div>
  )
}

