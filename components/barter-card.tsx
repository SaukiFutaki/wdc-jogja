"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProductData {
  id: string;
  sellerId: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  quantity: number | null;
  discount: number | null;
  condition: "new" | "used" | "rework" | string;
  status: string | null;
  primaryImageUrl?: string;
  sustainabilityRating?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface BarterCardProps {
  success: boolean;
  data: ProductData[] 
}

export default function BarterCard({ success, data }: BarterCardProps) {
  // Skip rendering if no success or no products
  if (!success || !data || data.length === 0) {
    return null;
  }

  const renderStars = (sustainabilityRating: number = 0) => {
    const stars = [];
    const fullStars = Math.floor(sustainabilityRating || 0);
    const hasHalfStar = (sustainabilityRating || 0) % 1 !== 0;

    // Add filled stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`star-${i}`}
          className="w-4 h-4 fill-orange-500 text-orange-500"
        />
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <div key="half-star" className="relative">
          <Star className="w-4 h-4 text-orange-500" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
          </div>
        </div>
      );
    }

    // Add empty stars
    const emptyStars = 5 - Math.ceil(sustainabilityRating || 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  // Animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: 0.1, // Changed delay to a number
      },
    },
  };

  return (
    <>
      {data.map((product, index) => {
        const {
          id,
          name,
          price,
          discount,
          primaryImageUrl,
          sustainabilityRating,
        } = product;

        const safePrice = price ?? 0;
        const safeDiscount = discount ?? 0;
        const discountedPrice =
          safeDiscount > 0
            ? safePrice - (safePrice * safeDiscount) / 100
            : safePrice;

        return (
          <motion.div
            key={id}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{ scale: 1.03 }}
            custom={index}
            transition={{ duration: 0.2 }}
          >
            <Link href={`/products/${id}`}>
              <div className="group cursor-pointer">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden h-64">
                  {safeDiscount > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded z-10">
                      -{discount}%
                    </div>
                  )}
                  <Image
                    src={primaryImageUrl || "/placeholder.svg"}
                    alt={name || "Product"}
                    width={300}
                    height={400}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>

                <div className="mt-3">
                  <h3 className="font-medium text-sm md:text-base line-clamp-1">
                    {name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-medium text-green-600">
                      {formatRupiah(discountedPrice)}
                    </span>
                    {safeDiscount > 0 && (
                      <span className="text-gray-500 line-through text-sm">
                        {formatRupiah(safePrice)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(sustainabilityRating)}
                    <span className="text-xs text-gray-500 ml-1">
                      (
                      {sustainabilityRating
                        ? sustainabilityRating.toFixed(1)
                        : "0.0"}
                      )
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </>
  );
}
