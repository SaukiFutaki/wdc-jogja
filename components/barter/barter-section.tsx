import React from "react";

import Link from "next/link";
import ProductCard from "../products/product-card";

export interface DataProps {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  discount: number;
  condition: string;
  status: string;
  primaryImageUrl?: string;
  sustainabilityRating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function BarterSection({ data }: { data: DataProps[] }) {
  return (
    <section className="py-16 mx-32">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">
          Barter 
        </h2>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data && data.length > 0 ? (
            data.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                sellerId={product.sellerId}
                description={product.description}
                category={product.category}
                condition={product.condition}
                status={product.status}
                primaryImageUrl={product.primaryImageUrl}
                name={product.name}
                price={product.price}
                discount={product.discount}
                sustainabilityRating={product.sustainabilityRating}
                quantity={product.quantity}
                createdAt={product.createdAt}
                updatedAt={product.updatedAt}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              Tidak ada produk tersedia
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-12">
          <Link href="/barter">
            <button className="px-8 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition">
              Lihat Semua
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}