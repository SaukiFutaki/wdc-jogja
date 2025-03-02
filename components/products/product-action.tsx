"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductActionsProps {
  colors: { name: string; class: string }[]
  sizes: string[]
}

export default function ProductActions({ colors, sizes }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(colors[0]?.name || "")
  const [selectedSize, setSelectedSize] = useState(sizes[1]?.toLowerCase() || "")

  return (
    <>
      {/* Color Selection */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Select Colors</h3>
        <div className="flex gap-2">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color.name)}
              className={`w-8 h-8 rounded-full ${color.class} ${
                selectedColor === color.name ? "ring-2 ring-offset-2 ring-black" : ""
              }`}
            />
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Choose Size</h3>
        <div className="flex gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size.toLowerCase())}
              className={`px-4 py-2 border rounded-md ${
                selectedSize === size.toLowerCase()
                  ? "bg-black text-white border-black"
                  : "border-gray-200 hover:border-black"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity and Add to Cart */}
      <div className="flex gap-4">
        <div className="flex items-center border rounded-md">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-100">
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 py-2 min-w-[40px] text-center">{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-gray-100">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <Button className="flex-1 bg-black hover:bg-gray-800">Add to Cart</Button>
      </div>
    </>
  )
}