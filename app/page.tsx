/* eslint-disable @typescript-eslint/no-unused-vars */
import { auth } from "@/auth";
import BarterSection from "@/components/barter/barter-section";
import ProductSection from "@/components/products/product-section";
import { Separator } from "@/components/ui/separator";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div>
      <section className=" bg-gray-100 px-6">
        <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">
              FIND <span className="text-orange-500">CLOTHES</span>
              <br />
              THAT MATCHES
              <br />
              YOUR STYLE
            </h1>
            <p className="text-gray-600 mb-8 max-w-md">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense
              of style.
            </p>
            <Link href="/shop">
              <button className="bg-orange-500 text-white px-8 py-3 rounded-full font-medium hover:bg-orange-600 transition">
                Shop Now
              </button>
            </Link>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <div className="relative">
              <Image
                src="/image_hero.svg"
                alt="Stylish man in checkered blazer"
                width={500}
                height={600}
                className="z-10 relative"
              />
              {/* Decorative stars */}
              <div className="absolute top-10 right-0 text-4xl">✧</div>
              <div className="absolute bottom-20 left-0 text-4xl">✦</div>
            </div>
          </div>
        </div>
      </section>
      <ProductSection />
      <div className="container mx-auto px-4 py-16">

      <Separator />
      </div>
      <BarterSection />
    </div>
  );
}
