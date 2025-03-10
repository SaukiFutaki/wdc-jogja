import { getAllProductsBarter } from '@/lib/actions/product'
import React from 'react'

export default async function Page() {
  const data = await getAllProductsBarter();
  return (
    <div>
      {JSON.stringify(data)}
    </div>
  )
}
