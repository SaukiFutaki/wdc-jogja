"use client";
import { getProductsTopRating } from "@/lib/actions/product";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface Product {
  id: string;
  name: string;
  price: number;
  primaryImageUrl: string;
  description: string;
}

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Format price to IDR
  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  // Fetch product data
  async function fetchProducts() {
    try {
      setLoading(true);
      const data = await getProductsTopRating(3);

      if (data?.data && data.data.length > 0) {
        const transformedProducts = data.data.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price || 0,
          primaryImageUrl:
            item.primaryImageUrl ||
            "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFuZ298ZW58MHx8MHx8fDA%3D",
          description: item.description || "",
        }));
        setProducts(transformedProducts);
      } else {
        setProducts([
          {
            id: "1",
            name: "Featured Product",
            price: 599000,
            primaryImageUrl:
              "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFuZ298ZW58MHx8MHx8fDA%3D",
            description: "MANGGA ENAK",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);

      setProducts([
        {
          id: "1",
          name: "Featured Product",
          price: 599000,
          primaryImageUrl: "/image_hero.svg",
          description: "Premium quality clothing for your style",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // Autoplay functionality
  useEffect(() => {
    if (products.length <= 1 || !autoplay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === products.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [autoplay, products.length]);

  // Pause autoplay when user interacts with controls
  const handleNavigation = (direction: "next" | "prev") => {
    if (products.length <= 1) return;

    setAutoplay(false);
    if (direction === "next") {
      setCurrentIndex((prevIndex) =>
        prevIndex === products.length - 1 ? 0 : prevIndex + 1
      );
    } else {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? products.length - 1 : prevIndex - 1
      );
    }
    // Resume autoplay after user interaction
    setTimeout(() => setAutoplay(true), 8000);
  };

  // Show loading state
  if (loading || products.length === 0) {
    return (
      <section className="bg-gray-100 px-6 overflow-hidden">
        <div className="container mx-auto px-4 py-16 flex items-center justify-center h-96">
          <div className="text-black ">...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white  overflow-hidden ">
      <div className=" py-16 flex flex-col md:flex-row items-center relative mt-20 mx-32">
        {/* Text content - left side */}
        <div className="md:w-1/2 z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">
                <span className="text-primary">
                  {products[currentIndex].name}
                </span>
                <br />
                {formatRupiah(products[currentIndex].price)}
                <br />
                <span className="text-2xl md:text-3xl">EXCLUSIVE STYLE</span>
              </h1>
              <p className="text-gray-600 mb-8 max-w-md">
                {products[currentIndex].description ||
                  "Quality clothing designed for your unique style"}
              </p>
              <div className="flex space-x-4">
                <Link
                  href={`/products/${
                    products.length > 0 ? products[currentIndex].id : "1"
                  }`}
                >
                  <button className="bg-card text-white px-8 py-3 rounded-full font-medium transition hover:bg-primary hover:text-white">
                    Beli Sekarang
                  </button>
                </Link>
                <Link href="/shop">
                  <button className="border-2 border-primary text-black px-8 py-3 rounded-full font-medium transition hover:bg-primary hover:text-white">
                    View All
                  </button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel - right side */}
        <div className="md:w-1/2 mt-8 md:mt-0 relative">
          <div className="relative h-96 md:h-96 w-full">
            {/* Decorative elements */}
            {/* <motion.div
              className="absolute top-10 right-0 text-4xl"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              ✧
            </motion.div> */}
            {/* <motion.div
              className="absolute bottom-20 left-0 text-4xl"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              ✦
            </motion.div> */}

            {/* Carousel */}
            <div className="relative w-full h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex justify-center items-center"
                >
                  <Image
                    src={
                      products[currentIndex].primaryImageUrl ||
                      "/placeholder.svg"
                    }
                    alt={products[currentIndex].name}
                    width={500}
                    height={600}
                    className="object-contain max-h-full"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation controls - only show if more than one product */}
              {products.length > 1 && (
                <>
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 mb-4">
                    {products.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          currentIndex === index
                            ? "w-6 bg-primary"
                            : "bg-gray-400"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Arrow navigation */}
                  <Button
                    onClick={() => handleNavigation("prev")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"
                    aria-label="Previous product"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={() => handleNavigation("next")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"
                    aria-label="Next product"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
