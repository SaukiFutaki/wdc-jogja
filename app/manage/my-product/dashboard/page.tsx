import { getAllProductsByUser } from '@/lib/actions/product'
import SectionDashProd from './section-dash'

export default async function Page() {
  
    const data = await getAllProductsByUser()
    const mappedData = data.data?.map(item => ({
      ...item,
      sustainableRating: item.sustainabilityRating || 0,
      description: item.description || '',
      price: item.price || 0,
      category: item.category || '',
      status: item.status || '',
      type: item.type || 'jual', // Add default value for type
      quantity: item.quantity || 0,
      discount: item.discount || 0,
      primaryImageUrl: item.primaryImageUrl || '',
      updatedAt: item.updatedAt.toString()
    })) || []
    
  return (
    <div>
        <SectionDashProd data={mappedData}/>
    </div>
  )
}
