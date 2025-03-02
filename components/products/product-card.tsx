import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

interface ProductCardProps {
  image: string
  title: string
  price: number
  originalPrice?: number
  discount?: number
  rating: number
  reviewCount: number
}

export default function ProductCard({
  image,
  title,
  price,
  originalPrice,
  discount,
  rating,
  reviewCount,
}: ProductCardProps) {
  // Generate filled and empty stars based on rating
  const renderStars = () => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    // Add filled stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="w-4 h-4 fill-orange-500 text-orange-500" />)
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <div key="half-star" className="relative">
          <Star className="w-4 h-4 text-orange-500" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
          </div>
        </div>,
      )
    }

    // Add empty stars
    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)
    }

    return stars
  }

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price)
  }



  return (
    <Link href={`/products/${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="group">
        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
          {discount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
              -{discount}%
            </div>
          )}
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
            <span className="font-medium">{formatRupiah(price)}</span>
            {originalPrice && <span className="text-gray-500 line-through text-sm">{formatRupiah(originalPrice)}</span>}
          </div>
          <div className="flex items-center gap-1 mt-1">
            {renderStars()}
            <span className="text-xs text-gray-500 ml-1">({reviewCount})</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

