import React from "react";
import ProductCard from "./product-card";
import Link from "next/link";

interface DemoDataProps {
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
}
const demoData: DemoDataProps[] = [
  {
    image: "/logo.svg",
    title: "T-Shirt With Tape Details",
    price: 150000,
    rating: 5,
    reviewCount: 88,
    discount: 10,
    originalPrice: 150000,
  },
  {
    image: "/logo.svg",
    title: "T-Shirt With Tape Details",
    price: 150000,
    rating: 5,
    reviewCount: 88,
    discount: 10,
    originalPrice: 150000,
  },
  {
    image: "/logo.svg",
    title: "T-Shirt With Tape Details",
    price: 150000,
    rating: 5,
    reviewCount: 88,
    discount: 10,
    originalPrice: 150000,
  },
  {
    image: "/logo.svg",
    title: "T-Shirt With Tape Details",
    price: 150000,
    rating: 5,
    reviewCount: 88,
    discount: 10,
    originalPrice: 150000,
  },
  {
    image: "/assests-wdc/gambar/image 9.png",
    title: "T-Shirt With Tape Details",
    price: 150000,
    rating: 5,
    reviewCount: 88,
    discount: 10,
    originalPrice: 150000,
  },
  {
    image: "/assests-wdc/gambar/image 8.png",
    title: "T-Shirt With Tape Details",
    price: 150000,
    rating: 5,
    reviewCount: 88,
    discount: 10,
    originalPrice: 150000,
  },
  {
    image: "/assests-wdc/gambar/image 7.png",
    title: "T-Shirt With Tape Details",
    price: 150000,
    rating: 5,
    reviewCount: 88,
    discount: 50,
    originalPrice: 150000,
  },
];

export default function ProductSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">SHOP</h2>

        {/* Category Filters */}
        {/* <div className="flex flex-wrap justify-start gap-2 mb-12">
          {["T-Shirt", "Sport", "Pants", "Jeans", "Shirt", "Long Shirt"].map(
            (category) => (
              <button
                key={category}
                className="px-4 py-1 border border-black rounded-full hover:bg-gray-100 transition"
              >
                {category}
              </button>
            )
          )}
        </div> */}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {demoData.map((data,index) => (
            <ProductCard
              key={index}
              image={data.image}
              title={data.title}
              price={(data.originalPrice ?? 0) - ((data.originalPrice ?? 0) * (data.discount ?? 0)) / 100}
              rating={data.rating}
              reviewCount={data.reviewCount}
              discount={data.discount}
              originalPrice={data.originalPrice || 0}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-12">
          <Link href="/shop">
            <button className="px-8 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition">
              View All
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
