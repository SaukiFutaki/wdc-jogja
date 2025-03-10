import { getAllProductRework } from '@/lib/actions/product';
import React from 'react'

export default async function Page() {
    const data = await getAllProductRework();
  return (
    <div className='flex items-center justify-center h-screen'>
        {JSON.stringify(data)}
    </div>
  )
}
