"use client"

import { useState } from "react"
import { Star, ChevronDown } from "lucide-react"

interface ReviewProps {
  name: string
  rating: number
  date: string
  content: string
}

interface ReviewSectionProps {
  reviews: ReviewProps[]
}

function ReviewCard({ name, rating, date, content }: ReviewProps) {
  return (
    <div className="border-b pb-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(rating) ? "fill-orange-500 text-orange-500" : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
        </div>
        <span className="font-medium">{name}</span>
      </div>
      <p className="text-gray-600 mb-2">{content}</p>
      <div className="text-sm text-gray-500">Posted on {date}</div>
    </div>
  )
}

export default function ReviewSection({ reviews }: ReviewSectionProps) {
  const [sortBy, setSortBy] = useState("latest")
  const [visibleReviews, setVisibleReviews] = useState(3)

  const loadMoreReviews = () => {
    setVisibleReviews(prevCount => Math.min(prevCount + 3, reviews.length))
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">All Reviews ({reviews.length})</h3>
        <button 
          className="flex items-center gap-2 text-sm border px-3 py-1.5 rounded-md"
          onClick={() => setSortBy(sortBy === "latest" ? "highest" : "latest")}
        >
          {sortBy === "latest" ? "Latest" : "Highest Rated"} <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-6">
        {reviews.slice(0, visibleReviews).map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </div>

      {visibleReviews < reviews.length && (
        <button 
          className="w-full mt-8 py-2 border rounded-md hover:bg-gray-50"
          onClick={loadMoreReviews}
        >
          Load More Reviews
        </button>
      )}
    </>
  )
}