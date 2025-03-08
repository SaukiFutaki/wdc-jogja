import { cn } from "@/lib/utils";
import { Marquee } from "./demo/marq";
import Image from "next/image";

const reviews = [
    {
      name: "Alya",
      username: "@alya23",
      body: "Bahan bajunya super nyaman dan jahitannya rapi. Suka banget!",
      img: "https://avatar.vercel.sh/alya",
    },
    {
      name: "Budi",
      username: "@budi_style",
      body: "Desainnya keren, persis seperti di foto! Pengiriman juga cepat.",
      img: "https://avatar.vercel.sh/budi",
    },
    {
      name: "Citra",
      username: "@citra_fashion",
      body: "Ukuran pas, kualitas bahan oke banget. Bakal beli lagi di sini!",
      img: "https://avatar.vercel.sh/citra",
    },
    {
      name: "Dewi",
      username: "@dewi_trendy",
      body: "Warnanya sesuai gambar, nyaman dipakai seharian. Recommended!",
      img: "https://avatar.vercel.sh/dewi",
    },
    {
      name: "Eko",
      username: "@eko_casual",
      body: "Bajunya stylish, cocok buat OOTD. Senang belanja di sini!",
      img: "https://avatar.vercel.sh/eko",
    },
    {
      name: "Fitri",
      username: "@fitri_fashionista",
      body: "Modelnya unik dan beda dari yang lain. Suka banget!",
      img: "https://avatar.vercel.sh/fitri",
    },
  ];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Image className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export function MarqueeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}
